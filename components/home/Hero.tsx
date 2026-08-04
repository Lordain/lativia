export default function Hero() {
    return (
        <section className="bg-gray-100 py-20">
            <div className="mx-auto max-w-5x1 px-6 text-center">
                <h1 className="text-5xl font-bold">墨西哥華人一站式辦事平台</h1>
                <p className="mt-6 text-xl text-gray-600">
                    RFC、CURP、SAT、銀行開戶、公司註冊、簽證代辦，
                    全程中文服務。
                </p>
            </div>
            <div className="mt-10 flex justify-center gap-4">
                <button className="rounded-lg bg-blue-600 px-6 py-3 text-white">開始辦理</button>
                <button className="rounded-lg border px-6 py-3">免费咨询</button>
            </div>
        </section>
    );
}