"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, Share2, Sparkles, ImageIcon } from "lucide-react"

interface GeneratedImage {
  id: string
  prompt: string
  url: string
  timestamp: Date
  style: string
}

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [selectedStyle, setSelectedStyle] = useState("realistic")

  const styles = [
    { id: "realistic", name: "Realistic", description: "Photorealistic images" },
    { id: "artistic", name: "Artistic", description: "Artistic and creative" },
    { id: "anime", name: "Anime", description: "Anime/manga style" },
    { id: "digital", name: "Digital Art", description: "Digital artwork" },
    { id: "oil", name: "Oil Painting", description: "Oil painting style" },
    { id: "watercolor", name: "Watercolor", description: "Watercolor painting" },
  ]

  const generateImage = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${prompt}, ${selectedStyle} style`,
          style: selectedStyle,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          prompt,
          url: data.imageUrl,
          timestamp: new Date(),
          style: selectedStyle,
        }
        setGeneratedImages((prev) => [newImage, ...prev])
        setPrompt("")
      }
    } catch (error) {
      console.error("Image generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ai-generated-${prompt.slice(0, 20)}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-secondary">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold">AI Image Generator</h3>
        </div>

        {/* Style Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-3 block">Art Style</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  selectedStyle === style.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-medium text-sm">{style.name}</div>
                <div className="text-xs text-muted-foreground">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="flex gap-3">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="flex-1"
            onKeyPress={(e) => e.key === "Enter" && generateImage()}
          />
          <Button onClick={generateImage} disabled={isGenerating || !prompt.trim()} className="px-6">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Generated Images Gallery */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Generated Images</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedImages.map((image) => (
              <Card key={image.id} className="glass overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => downloadImage(image.url, image.prompt)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={() => navigator.share?.({ url: image.url })}
                    >
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{image.prompt}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {image.style}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{image.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
