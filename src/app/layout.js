import { Montserrat } from "next/font/google";
import "./globals.css";
import "./style.css";
import NoticeModal from "./notice-modal/noticeModal";
// import Container from "@/components/Container";

import dynamic from "next/dynamic";

const Container = dynamic(() => import("../components/Container"), {
    ssr: false
});
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
    title: "Land and Development Office | Ministry of Housing & Urban Affairs",
    description:
        ""
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={montserrat.className}>
                <Container>{children}</Container>
                <NoticeModal />
            </body>
        </html>
    );
}
