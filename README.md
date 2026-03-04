## Share your files with a link
Thanks to [uploadthing](https://uploadthing.com/).
- Share files through public links
- Support for multiple file types:
  - Images (up to 8MB)
  - Videos (up to 64MB)
  - Audio files (up to 4MB)
  - PDFs (up to 4MB)
  - Text files (up to 64KB)
  - Blob files (up to 8MB)

## Project Structure

- `app/page.tsx` - Main landing page with file upload options
- `app/[type]` - Individual upload pages for different file types
- `app/api/uploadthing` - Uploadthing API configuration and route handlers
