// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <title>ARUPADAI NATURALS | Rooted in Tradition, Inspired by Nature</title>
                <meta
                    name="description"
                    content="Rooted in Tradition, Inspired by Nature"
                />
                <link rel="icon" href="/favicon.ico" />
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                <meta name="google-site-verification" content="xsi4c_3nbHX9hZ-382WQBh0lygG_QDaAwSJW2VihXV8" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
