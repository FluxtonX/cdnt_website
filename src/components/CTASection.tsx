import { Button } from "./ui/Button";

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-primary-navy rounded-[2.5rem] py-20 px-8 md:px-16 text-center overflow-hidden shadow-2xl">
          
          {/* Inner Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] md:w-[80%] h-[120%] md:h-[80%] bg-primary-blue/30 blur-[120px] rounded-full pointer-events-none" />
          
          {/* Subtle Grid Overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-10" 
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px"
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-accent-gold font-semibold tracking-widest text-sm uppercase mb-6">
              Your Financial Future
            </p>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
              Your Financial Future, <br />
              <span className="text-accent-gold">Unified.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              Join 2M+ Canadians saving, banking and investing — with the 
              confidence of regulation and the speed of crypto.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button variant="gold" className="w-full sm:w-auto h-14 px-8 text-base shadow-lg shadow-accent-gold/20">
                Open Account
              </Button>
              <Button variant="ghost-dark" className="w-full sm:w-auto h-14 px-8 text-base">
                Talk to our Team
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
