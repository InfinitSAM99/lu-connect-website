export default function Privacy() {
  return (
    <div className="max-w-[800px] mx-auto py-10">
      <div className="text-center mb-[40px]">
        <h1 className="text-[42px] font-black">Privacy Policy</h1>
      </div>
      
      <div className="space-y-5">
        {[
          { title: "1. Data Collection", text: "We collect your name, email, university details, and profile picture to create your LU Connect account." },
          { title: "2. Data Usage", text: "Your data is used to verify your student status and connect you with your campus community. We do not sell your data." },
          { title: "3. Security", text: "We use advanced encryption to protect your messages and personal information. Your privacy is our priority." }
        ].map((item, i) => (
          <div key={i} className="bg-surface border border-border rounded-[20px] p-[30px] hover:border-luRed/50 transition-colors">
            <h3 className="text-luGold text-[22px] font-bold mb-3">{item.title}</h3>
            <p className="text-muted leading-[1.7]">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
