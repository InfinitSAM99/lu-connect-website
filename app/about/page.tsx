export default function About() {
  return (
    <div className="max-w-[800px] mx-auto py-10">
      <div className="text-center mb-[50px]">
        <h1 className="text-[42px] font-black mb-3">About LU Connect</h1>
        <p className="text-muted text-[18px]">Our story is one of innovation, community, and a deep love for Kenya.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-[50px]">
        <div className="bg-surface border border-border rounded-[20px] p-[30px] hover:border-luRed/50 transition-colors">
          <h3 className="text-luGold text-[24px] font-bold mb-3">Our Mission</h3>
          <p className="text-muted leading-[1.7]">To connect every university student in Kenya with their campus community, providing a safe, premium, and localized social space.</p>
        </div>
        <div className="bg-surface border border-border rounded-[20px] p-[30px] hover:border-luRed/50 transition-colors">
          <h3 className="text-luGold text-[24px] font-bold mb-3">Our Vision</h3>
          <p className="text-muted leading-[1.7]">We aim to be the number one social app for all public and private universities, supporting students from high school through to graduation.</p>
        </div>
      </div>

      <div className="flex items-center gap-[30px] bg-gradient-to-br from-[#0a0a0a] to-[#111] border border-border rounded-[24px] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="w-[120px] h-[120px] rounded-full border-[4px] border-luGold shadow-[0_0_20px_rgba(255,215,0,0.3)] flex items-center justify-center bg-luRed text-4xl font-black text-white flex-shrink-0">
          SM
        </div>
        <div>
          <h3 className="text-white text-[28px] font-bold mb-1">Samuel Mugasia</h3>
          <p className="text-luGold text-[16px] font-bold mb-2">Founder & CEO</p>
          <span className="text-muted text-[16px] italic leading-[1.5]">Built with passion from Kenya.</span>
        </div>
      </div>
    </div>
  );
}
