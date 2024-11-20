import clsx from 'clsx';  //Hier wird die clsx-Bibliothek importiert, die verwendet wird, um bedingt Klassen zu kombinieren. Das ist nützlich, um CSS-Klassen basierend auf bestimmten Bedingungen zusammenzustellen.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'px-2 py-1 rounded bg-blue-300 hover:bg-blue-500 text-slate-700 hover:text-black',
        className,
      )}
    >
      {children}
    </button>
  );
}
