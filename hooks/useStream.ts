import { askWithStream } from "@/src/api";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";

interface Options {
  onNewPartial: (partial: string) => void;
  onStartStream: () => void;
  onEndStream: () => void;
}

export function useStream(options: Options) {
  // const [partial, setPartial] = useState<string | undefined>();
  const partialRef = useRef<string>();
  const [loading, setLoading] = useState(false);
  const onNewChunkRef = useRef(options.onNewPartial);
  const onStartStreamRef = useRef(options.onStartStream);
  const onEndStreamRef = useRef(options.onEndStream);

  useLayoutEffect(() => {
    onNewChunkRef.current = options.onNewPartial;
    onStartStreamRef.current = options.onStartStream;
    onEndStreamRef.current = options.onEndStream;
  });

  const run = useCallback(async (message: string) => {
    setLoading(true);
    const response = await askWithStream(message);
    const reader = response?.body?.getReader();

    if (!reader) {
      setLoading(false);
      return;
    }

    const decoder = new TextDecoder();
    options.onStartStream();
    let count = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        reader.releaseLock();
        setLoading(false);
        onEndStreamRef.current();
        partialRef.current = undefined;
        break;
      }

      const chunk = decoder.decode(value, { stream: true });

      try {
        chunk.split("data: ").forEach((singleChunk) => {
          if (!!singleChunk) {
            const obj = JSON.parse(singleChunk);
            const text: string = obj.data;
            partialRef.current = (partialRef.current || "") + text;
            options.onNewPartial(partialRef.current);
          }
        });
      } catch (error) {
        console.error("Error parsing chunk", chunk, " =>", error);
        partialRef.current = undefined;
      }
    }
  }, []);

  return {
    // chunk: partial,
    run,
    loading,
  };
}
