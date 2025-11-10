
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BrainCircuit, Sparkles, Send } from 'lucide-react';
import { askIntelligence } from '@/ai/flows/intelligence-flow';
import ReactMarkdown from 'react-markdown';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
} from 'recharts';

const examplePrompts = [
  'Qual o tipo de crime mais comum no último mês?',
  'Quais os 3 bairros com mais ocorrências?',
  'Qual o dia da semana com mais registros de furto?',
  'Gere um gráfico de pizza com a distribuição de naturezas de ocorrência.',
];

const renderers = {
  h1: (props: any) => <h1 className="text-2xl font-bold my-4" {...props} />,
  h2: (props: any) => <h2 className="text-xl font-semibold my-3" {...props} />,
  h3: (props: any) => <h3 className="text-lg font-semibold my-2" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside my-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside my-2" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  p: (props: any) => <p className="mb-2" {...props} />,
  code: (props: any) => {
    const { children, className } = props;
    const match = /language-(\w+)/.exec(className || '');
    if (match && match[1] === 'chart') {
      try {
        const chartData = JSON.parse(children);
        const { type, data, config } = chartData;

        const chartComponents: { [key: string]: React.ReactNode } = {
          bar: (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey={config.yAxis} fill={config.fill || "hsl(var(--primary))"} />
            </BarChart>
          ),
          line: (
             <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={config.xAxis} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey={config.yAxis} stroke={config.stroke || "hsl(var(--primary))"} />
            </LineChart>
          ),
          pie: (
             <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie data={data} dataKey={config.dataKey} nameKey={config.nameKey} cx="50%" cy="50%" outerRadius={80}>
                 {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          )
        };
        
        const ChartComponent = chartComponents[type];

        if (ChartComponent) {
          return (
            <ChartContainer config={{}} className="min-h-[200px] w-full">
              {ChartComponent}
            </ChartContainer>
          );
        }

      } catch (e) {
        console.error("Failed to parse chart JSON:", e);
        return <p className='text-destructive'>Erro ao renderizar gráfico.</p>;
      }
    }
    return <code className="bg-muted p-1 rounded-sm" {...props} />;
  },
};

export default function IntelligencePage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse('');
    try {
      const result = await askIntelligence(prompt);
      setResponse(result);
    } catch (error) {
      console.error(error);
      setResponse('Desculpe, ocorreu um erro ao processar sua solicitação.');
    }
    setIsLoading(false);
  };
  
  const handleExampleClick = (example: string) => {
    setPrompt(example);
  }

  useEffect(() => {
    if (endOfMessagesRef.current) {
        endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response, isLoading]);

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-6">
        <h1 className="flex-1 font-headline text-lg font-semibold md:text-xl flex items-center gap-2">
          <BrainCircuit />
          INTEL GCM
        </h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl space-y-6">
           {!response && !isLoading && (
              <Card className="text-center">
                <CardHeader>
                  <CardTitle>Olá! Como posso ajudar a analisar os dados hoje?</CardTitle>
                  <CardDescription>
                    Faça perguntas em linguagem natural sobre as ocorrências registradas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm font-medium text-muted-foreground">Experimente um destes exemplos:</p>
                   <div className="flex flex-wrap justify-center gap-2">
                        {examplePrompts.map((example) => (
                        <Button
                            key={example}
                            variant="outline"
                            size="sm"
                            onClick={() => handleExampleClick(example)}
                        >
                            {example}
                        </Button>
                        ))}
                    </div>
                </CardContent>
              </Card>
           )}
          
          {response && (
            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-primary"/>
                  Resposta da IA
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                 <ReactMarkdown components={renderers}>{response}</ReactMarkdown>
              </CardContent>
            </Card>
          )}

          {isLoading && (
             <Card>
              <CardContent className="p-6 flex items-center justify-center gap-3">
                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                 <p className="text-muted-foreground">Analisando dados e gerando resposta...</p>
              </CardContent>
            </Card>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </main>

       <footer className="sticky bottom-0 bg-background/95 backdrop-blur-sm p-4 border-t">
          <div className="mx-auto max-w-4xl">
             <form onSubmit={handleSubmit} className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Pergunte algo sobre as ocorrências..."
                className="w-full pr-16 resize-none"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                }}
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-3 top-1/2 -translate-y-1/2"
                disabled={isLoading || !prompt.trim()}
              >
                <Send />
                 <span className="sr-only">Enviar</span>
              </Button>
            </form>
          </div>
       </footer>

    </div>
  );
}
