import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Upload } from "lucide-react";
import { useProjects } from "../hooks/useApi";
import { useCurrentProject } from "../context/CurrentProject";

export default function Onboarding() {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const { setProject } = useCurrentProject();
  const [projectName, setProjectName] = useState("");
  const [inputType, setInputType] = useState<"transcript" | "email">("transcript");
  const [content, setContent] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!projectName || !content) return;
    setError(null);
    setSubmitting(true);
    try {
      const project = await createProject(projectName, content.slice(0, 2000));
      setProject(project.id, project.name);
      navigate("/suggest-team", {
        state: { projectId: project.id, projectName, inputType, content },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao criar projeto. Verifique se a API está rodando em http://localhost:8000");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#DBEAFE] flex items-center justify-center p-8">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[700px]">
          {/* Left Hero Column (40%) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#1B3A6B] to-[#2563EB] p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Abstract network illustration */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 400 600">
                <circle cx="100" cy="150" r="40" fill="#0EA5E9" />
                <circle cx="300" cy="200" r="30" fill="#0EA5E9" />
                <circle cx="200" cy="350" r="35" fill="#0EA5E9" />
                <circle cx="350" cy="450" r="25" fill="#0EA5E9" />
                <circle cx="80" cy="500" r="30" fill="#0EA5E9" />
                <line x1="100" y1="150" x2="300" y2="200" stroke="#0EA5E9" strokeWidth="2" />
                <line x1="300" y1="200" x2="200" y2="350" stroke="#0EA5E9" strokeWidth="2" />
                <line x1="200" y1="350" x2="350" y2="450" stroke="#0EA5E9" strokeWidth="2" />
                <line x1="200" y1="350" x2="80" y2="500" stroke="#0EA5E9" strokeWidth="2" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#1B3A6B]">PM</span>
                </div>
                <h1 className="text-3xl font-bold text-white">ProjectMind AI</h1>
              </div>

              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                De transcrição<br />a estratégia<br />em minutos
              </h2>

              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                Transforme suas reuniões e emails em projetos estruturados com sugestões inteligentes de equipe e agentes de IA especializados.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">✓</div>
                  <span className="text-white">Análise automática de contexto</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">✓</div>
                  <span className="text-white">Sugestão inteligente de time</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">✓</div>
                  <span className="text-white">Monitoramento em tempo real</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column (60%) */}
          <div className="lg:col-span-3 p-12 flex flex-col justify-center">
            <div className="max-w-xl mx-auto w-full">
              <h3 className="text-2xl font-bold text-[#1B3A6B] mb-2">
                Iniciar Novo Projeto
              </h3>
              <p className="text-gray-600 mb-8">
                Cole a transcrição ou thread de email para começar
              </p>

              <div className="space-y-6">
                {/* Project Name */}
                <div>
                  <Label htmlFor="project-name" className="text-[#1B3A6B]">
                    Nome do Projeto
                  </Label>
                  <Input
                    id="project-name"
                    placeholder="Ex: Lançamento App Mobile"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-2 h-12 border-gray-300 focus:border-primary"
                  />
                </div>

                {/* Input Type Tabs */}
                <div>
                  <Label className="text-[#1B3A6B] mb-2 block">
                    Tipo de Entrada
                  </Label>
                  <Tabs value={inputType} onValueChange={(v) => setInputType(v as any)}>
                    <TabsList className="grid w-full grid-cols-2 h-12">
                      <TabsTrigger value="transcript" className="text-base">
                        📋 Transcrição de Reunião
                      </TabsTrigger>
                      <TabsTrigger value="email" className="text-base">
                        📧 Thread de E-mail
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="transcript" className="mt-4">
                      <Textarea
                        placeholder="Cole aqui a transcrição ou thread de e-mail do projeto..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={10}
                        className="min-h-[200px] border-gray-300 focus:border-primary resize-none"
                      />
                    </TabsContent>

                    <TabsContent value="email" className="mt-4">
                      <Textarea
                        placeholder="Cole aqui a transcrição ou thread de e-mail do projeto..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={10}
                        className="min-h-[200px] border-gray-300 focus:border-primary resize-none"
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* File Upload */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-primary bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Arraste e solte ou{" "}
                    <label className="text-primary cursor-pointer hover:underline">
                      selecione um arquivo
                      <input type="file" className="hidden" accept=".txt,.docx,.pdf" />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">
                    Suporta .txt, .docx, .pdf
                  </p>
                </div>

                {/* Analyze Button */}
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                )}
                <Button
                  onClick={handleAnalyze}
                  disabled={!projectName || !content || submitting}
                  size="lg"
                  className="w-full h-14 text-base bg-[#2563EB] hover:bg-[#1d4ed8]"
                >
                  {submitting ? "Criando projeto..." : "Analisar com IA →"}
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>🔒 Seus dados são processados sem retenção</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
