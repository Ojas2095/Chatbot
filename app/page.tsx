import { ChatInterface } from "@/components/chat-interface"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <main className="min-h-screen relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"></div>
          </div>

          <div className="relative z-10 container mx-auto max-w-7xl px-4 py-8">
            <div className="text-center mb-8">
              <div className="glass rounded-3xl p-8 mb-8 mx-auto max-w-4xl">
                <h1 className="text-6xl font-bold gradient-text mb-6 animate-glow">AI Chatbot Ultra</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Experience the future of AI conversation with our ultra-modern chatbot featuring multi-model support,
                  advanced memory, voice interaction, and premium aesthetics.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm">
                  <span className="glass rounded-full px-4 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    Multi-Model AI
                  </span>
                  <span className="glass rounded-full px-4 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                    Voice Interaction
                  </span>
                  <span className="glass rounded-full px-4 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    Advanced Memory
                  </span>
                  <span className="glass rounded-full px-4 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    File Processing
                  </span>
                </div>
              </div>
            </div>
            <ChatInterface />
          </div>
        </main>
      </AuthProvider>
    </ThemeProvider>
  )
}
