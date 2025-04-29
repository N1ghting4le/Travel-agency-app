import localFont from "next/font/local";
import GlobalContext from "@/components/GlobalContext";
import "./globals.css";

const montserrat = localFont({
  src: "./fonts/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat",
  weight: "100 900"
});

const iconFont = localFont({
  src: "./fonts/line-rounded-icon-font.ttf",
  variable: "--font-icon",
  weight: "100 900"
});

export const metadata = {
  title: "Туристическое агентство"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${iconFont.variable}`}>
        <GlobalContext>
          {children}
        </GlobalContext>
      </body>
    </html>
  );
}