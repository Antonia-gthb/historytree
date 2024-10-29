import Image from 'next/image';

export default function Page() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12 border border-red-500 bg-gray-200 h-64">
            <div className="flex-shrink-0">
                <Image
                    src="/mhn_tree.png"
                    width={520}
                    height={419}
                    alt="Picture showing a Mutual Hazard Network Patient Tree"
                />
            </div>
            <div className="ml-6 mt-6 md:mt-0"> {/* Abstand zwischen Bild und Text */}
                <h1>Hello, Next.js!</h1>
                <p>
                    Hier ist ein zusätzlicher Text, der neben dem Bild angezeigt wird.
                </p>
            </div>
            <div className="bg-red-500 p-6">
                <h1 className="text-white">Test</h1>
            </div>
        </div>
    );
}
