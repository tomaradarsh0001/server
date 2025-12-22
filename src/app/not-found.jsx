"use client"
import Link from 'next/link'
import Image from "next/image";
import NFImage from "../../public/404-error.png";


export default function NotFound() {
    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                {/* Decorative 404 number */}
                <div className="relative">
                    <Image
                        src={NFImage}
                        alt={NFImage}
                        className="w-12 h-12 md:w-auto md:h-auto object-cover m-auto"
                        width={100}
                        height={100}
                    />
                    <h1 className="text-[40px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 leading-none" style={{ backgroundImage: 'linear-gradient(to right, rgb(51 130 234), #0f3557)' }} >
                        404
                    </h1>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 opacity-30 blur-3xl -z-10"></div>
                </div>

                {/* Error message */}
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                    Page not found
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-lg mx-auto">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
                </p>

                {/* Action buttons */}
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/"
                        className="rounded-xl bg-gradient-to-r from-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-all duration-200" style={{ backgroundImage: 'linear-gradient(to right, rgb(51 130 234), #0f3557)' }}
                    >
                        Go back home
                    </Link>
                </div>

                {/* Decorative elements */}
                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                    <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-600 to-pink-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
                </div>
            </div>
        </div >
    )
}
