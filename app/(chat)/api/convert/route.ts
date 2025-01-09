// app/api/convert/route.ts

import { NextResponse } from 'next/server'
import { auth } from '@/app/(auth)/auth'
import type { NextRequest } from 'next/server'
import MarkdownIt from 'markdown-it'
import puppeteer, { type Browser, PDFOptions } from 'puppeteer'
import puppeteerCore, { type Browser as BrowserCore } from 'puppeteer-core'
import chromium from '@sparticuz/chromium-min'

// Import your authentication function

// Optional: Define a schema for validation (e.g., using Zod)
import { z } from 'zod'

// Define a schema for the request body
const MarkdownSchema = z.object({
  markdown: z.string().min(1, 'Markdown content is required.'),
})

// Function to convert Markdown to PDF Buffer
const markdownToPdf = async (
  markdown: string,
  options?: PDFOptions
): Promise<Buffer> => {
  // Initialize Markdown-It with desired options
  const md = new MarkdownIt({
    html: true, // Enable HTML tags in source
    linkify: true, // Autoconvert URL-like text to links
    typographer: true, // Enable smartypants and other sweet transforms
  })

  // Convert Markdown to HTML
  const htmlContent = md.render(markdown)

  // Wrap the HTML content with a basic HTML structure and optional CSS
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Document</title>
        <style>
                @page {
            margin: 20mm;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            box-sizing: border-box;
          }
          .content {
            padding: 10mm;
          }
          h1, h2, h3, h4, h5, h6 {
            color: #333;
          }
          pre {
            background-color: #f4f4f4;
            padding: 10px;
            overflow-x: auto;
          }
          code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 4px;
          }
          /* Ensure consistent spacing across pages */
          p, ul, ol, blockquote, table, pre {
            orphans: 3;
            widows: 3;
          }
          /* Prevent breaking inside elements */
          h1, h2, h3, h4, h5, h6, pre, blockquote {
            page-break-inside: avoid;
          }
          /* Add more custom styles as needed */
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `

  // Launch Puppeteer
  let browser: Browser | BrowserCore
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production'
  ) {
    // Configure the version based on your package.json (for your future usage).
    const executablePath = await chromium.executablePath(
      'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
    )
    browser = await puppeteerCore.launch({
      executablePath,
      // You can pass other configs as required
      args: chromium.args,
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    })
  } else {
    // console.log(process.env.NODE_ENV)
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  }

  try {
    const page = await browser.newPage()

    // Set the HTML content
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' })

    // Generate PDF as Buffer
    const pdfBuffer = Buffer.from(
      await page.pdf({
        format: 'A4',
        printBackground: true,
        ...options, // Spread any additional options
      })
    )

    return pdfBuffer
  } catch (error) {
    throw error
  } finally {
    await browser.close()
  }
}

export async function POST(request: NextRequest) {
  // Authenticate the user/session
  const session = await auth()



  if (!session || !session.user) {
    throw new Error('Unauthorized')
  }
  // Ensure the request has a body
  const contentType = request.headers.get('Content-Type') || ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { error: 'Invalid Content-Type. Expected application/json.' },
      { status: 400 }
    )
  }

  let body: any
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  // Validate the request body
  const parsed = MarkdownSchema.safeParse(body)
  if (!parsed.success) {
    const errorMessage = parsed.error.errors
      .map((err) => err.message)
      .join(', ')
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }

  const escapeNumberedLines = (markdown: string): string => {
    return markdown.replace(/^(\d+)\.\s/gm, '$1\\. ')
  }

  const { markdown } = parsed.data

  try {
    const pdfBuffer = await markdownToPdf(escapeNumberedLines(markdown))

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=document.pdf',
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF.' },
      { status: 500 }
    )
  }
}
