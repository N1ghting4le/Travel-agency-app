import localFont from "next/font/local";
import GlobalContext from "@/components/globalContext/GlobalContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";

const montserrat = localFont({
  src: "./fonts/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat",
  weight: "100 900",
});

const iconFont = localFont({
  src: "./fonts/line-rounded-icon-font.ttf",
  variable: "--font-icon",
  weight: "100 900",
});

export const metadata = {
  title: "Туристическое агентство",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${iconFont.variable}`}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          <GlobalContext>{children}</GlobalContext>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
