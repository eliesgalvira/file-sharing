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

- `src/modules/uploads` - Deep upload module with the public catalog, client helpers, router, and tests
- `src/app/(overview)` - Main landing page with file upload options
- `src/app/(upload)` - Individual upload pages for different file types
- `src/app/api/uploadthing` - Thin route re-export around the upload module

## Tooling

- Package manager: `bun`
- Runtime Effect dependency: `effect@beta`
- Effect language service: `@effect/language-service`

## Commands

- `bun dev`
- `bun run typecheck`
- `bun test`
