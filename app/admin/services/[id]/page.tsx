interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: Props) {
    const { id } = await params;
    
    return (
        <main className="mx-auto max-w-4xl p-8">
            <h1 className="text-3xl font-bold">编辑服务</h1>
            <p className="text-sm text-gray-500">当前Service ID:</p>
            <code>{id}</code>
        </main>
    );
}