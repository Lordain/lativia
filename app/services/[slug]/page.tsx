interface Props {
    params: {
        slug: string;
    }
}

export default function ServicePage({ params }: Props) {
    return (
        <main className="mx-auto max-w-4x1 p-8">
            <h1 className="text-4xl font-bold">
                {params.slug}
            </h1>
        </main>
    )
}