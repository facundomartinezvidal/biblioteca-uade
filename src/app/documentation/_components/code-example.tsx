import React from "react";

interface CodeExampleProps {
  title: string;
  code: Record<string, unknown> | null;
  placeholder?: string;
}

function highlightJSON(obj: Record<string, unknown>): React.ReactElement {
  const jsonString = JSON.stringify(obj, null, 2);

  // Función simplificada pero más efectiva para colorear JSON
  const colorizeJSON = (str: string): React.ReactElement => {
    const lines = str.split("\n");

    return (
      <>
        {lines.map((line, lineIndex) => {
          if (!line.trim()) {
            return (
              <React.Fragment key={lineIndex}>
                <br />
              </React.Fragment>
            );
          }

          // Procesar cada línea
          const processLine = (lineText: string): React.ReactElement => {
            // Detectar key-value pairs
            const keyValueMatch = /^(\s*)(".*?")\s*:\s*(.*)$/.exec(lineText);

            if (keyValueMatch) {
              const [, indent, key, value] = keyValueMatch;

              return (
                <>
                  <span className="text-gray-400 dark:text-gray-500">
                    {indent}
                  </span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {key}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500">: </span>
                  {colorizeValue(value ?? "")}
                </>
              );
            }

            // Si no es key-value, colorear como estructura
            return (
              <span className="text-gray-400 dark:text-gray-500">
                {lineText}
              </span>
            );
          };

          const colorizeValue = (value: string): React.ReactElement => {
            const trimmedValue = value.trim();

            // String values - Verde más oscuro para mejor contraste
            if (/^".*"[,]?$/.test(trimmedValue)) {
              return (
                <span className="text-green-600 dark:text-green-400">
                  {value}
                </span>
              );
            }

            // Numbers - Azul más oscuro
            if (/^\d+\.?\d*[,]?$/.test(trimmedValue)) {
              return (
                <span className="text-blue-600 dark:text-blue-400">
                  {value}
                </span>
              );
            }

            // Booleans - Naranja más oscuro
            if (/^(true|false)[,]?$/.test(trimmedValue)) {
              return (
                <span className="text-orange-600 dark:text-orange-400">
                  {value}
                </span>
              );
            }

            // Null - Gris más oscuro
            if (/^null[,]?$/.test(trimmedValue)) {
              return (
                <span className="text-gray-500 dark:text-gray-400">
                  {value}
                </span>
              );
            }

            // Objects/Arrays or other structures
            return (
              <span className="text-gray-400 dark:text-gray-500">{value}</span>
            );
          };

          return (
            <React.Fragment key={lineIndex}>
              {processLine(line)}
              {lineIndex < lines.length - 1 && <br />}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return colorizeJSON(jsonString);
}

export default function CodeExample({
  title,
  code,
  placeholder,
}: CodeExampleProps) {
  const displayCode = code ?? {};
  const hasContent = Object.keys(displayCode).length > 0;

  return (
    <div>
      <h4 className="mb-2 text-sm font-medium">{title}</h4>
      <div className="rounded-md border border-gray-200 bg-gray-100 p-3 dark:border-gray-800 dark:bg-gray-900">
        {hasContent ? (
          <pre className="overflow-x-auto text-xs font-normal">
            <code>{highlightJSON(displayCode)}</code>
          </pre>
        ) : (
          <div className="text-xs font-normal text-gray-500 italic dark:text-gray-400">
            {placeholder ?? "No example available"}
          </div>
        )}
      </div>
    </div>
  );
}
