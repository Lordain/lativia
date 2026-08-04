interface Props {
    serviceName: string;
  }
  
  export default function ContactButton({
    serviceName,
  }: Props) {
  
    const phone = "5215512345678";
  
    const message =
      `您好，我想咨询 ${serviceName} 的办理服务。`;
  
    const url =
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-flex rounded-lg bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700"
      >
        💬 WhatsApp 免費諮詢
      </a>
    );
  }