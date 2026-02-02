export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Ayaan Alam",
        "url": process.env.NEXT_PUBLIC_APP_URL || "https://ayaan-alam.vercel.app",
        "jobTitle": "Software Engineer",
        "sameAs": [
            "https://github.com/ayaan07alam",
            "https://linkedin.com/in/ayaan07alam"
        ],
        "email": "ayaanalam78670@gmail.com",
        "worksFor": {
            "@type": "Organization",
            "name": "Freelance"
        },
        "description": "Software Engineer and Full Stack Developer passionate about building exceptional digital experiences."
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
