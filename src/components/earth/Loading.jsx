export default function Loading({progress = 0}) {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-white">
            <div className="text-4xl font-semibold mb-4">Chargement...</div>
            <div className="mt-2 text-md">{progress}%</div>
        </div>
    );
}
