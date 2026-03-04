import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center">
        <h1 className="text-4xl font-bold">Share your files with a link</h1>
        <p className="text-2xl -mt-6">by Elies</p>
        <p className="text-lg mb-8">Upload the file to one of the formats below and a public link will be generated to access the file.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
          <Link href="/image" className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Image Upload</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload images up to 8MB</p>
          </Link>
          
          <Link href="/video" className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Video Upload</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload videos up to 64MB</p>
          </Link>
          
          <Link href="/audio" className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Audio Upload</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload audio files up to 4MB</p>
          </Link>
          
          <Link href="/pdf" className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <h2 className="text-xl font-semibold mb-2">PDF Upload</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload PDFs up to 4MB</p>
          </Link>
          
          <Link href="/text" className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Text Upload</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload text files up to 64KB</p>
          </Link>

          <Link href="/blob" className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Blob Upload</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload blob files up to 8MB</p>
          </Link>

        </div>
      </main>
    </div>
  );
}
