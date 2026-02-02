

# Plano: Melhorar Campo de Digitacao do Chat

## Objetivo
Remover os botoes de anexo e imagem nao utilizados, aumentar o espaco de digitacao e permitir que o campo cresca automaticamente ate o dobro do tamanho quando o texto ultrapassar uma linha.

---

## Alteracoes Tecnicas

### Arquivo: `src/pages/Chat.tsx`

#### 1. Remover imports nao utilizados
- Remover `ImageIcon` e `Paperclip` dos imports do lucide-react (linhas 8-13)

#### 2. Remover botoes de anexo e imagem
- Remover os dois botoes `Button` com icones `Paperclip` e `ImageIcon` (linhas 300-305)

#### 3. Substituir Input por Textarea
- Trocar o componente `Input` por `Textarea` do shadcn/ui
- Adicionar import do `Textarea` no topo do arquivo

#### 4. Configurar Textarea com crescimento automatico
- Altura minima: 40px (altura atual do Input)
- Altura maxima: 80px (dobro do tamanho)
- Propriedade `resize: none` para desabilitar redimensionamento manual
- Auto-crescimento baseado no conteudo com `scrollHeight`

#### 5. Ajustar handler de teclas
- Manter Enter para enviar (sem Shift)
- Shift+Enter para nova linha (comportamento padrao do textarea)

---

## Codigo Resultante da Area de Input

```tsx
{/* Input Area */}
<div className="border-t bg-card/80 backdrop-blur-sm">
  <div className="container mx-auto px-4 py-4 max-w-4xl">
    <div className="flex gap-2 items-end">
      <Textarea
        placeholder="Digite sua pergunta sobre saúde, nutrição ou exercícios..."
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value);
          // Auto-resize
          e.target.style.height = 'auto';
          e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
        }}
        onKeyDown={handleKeyPress}
        disabled={loading}
        className="flex-1 min-h-[40px] max-h-[80px] resize-none py-2"
        rows={1}
      />
      <Button 
        onClick={sendMessage} 
        disabled={loading || !newMessage.trim()}
        size="icon"
        className="flex-shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
    <p className="text-xs text-muted-foreground mt-2 text-center">
      A IA pode cometer erros. Considere verificar informações importantes com profissionais de saúde.
    </p>
  </div>
</div>
```

---

## Comportamento Esperado

| Cenario | Comportamento |
|---------|---------------|
| Texto curto (1 linha) | Campo com altura de 40px |
| Texto medio (2-3 linhas) | Campo cresce ate 80px |
| Texto longo (4+ linhas) | Campo fica em 80px com scroll interno |
| Shift+Enter | Quebra de linha no texto |
| Enter (sem Shift) | Envia a mensagem |

---

## Resumo das Mudancas

1. **Remover**: Imports `ImageIcon`, `Paperclip`
2. **Remover**: 2 botoes de anexo/imagem
3. **Adicionar**: Import do `Textarea`
4. **Substituir**: `Input` por `Textarea` com auto-resize
5. **Ajustar**: Layout com `items-end` para alinhar botao ao fundo

