'use client';

import { Zap, Download } from "lucide-react";

export default function ResumePage() {
    return (
        <div className="min-h-screen bg-white text-black p-8 md:p-16 font-sans selection:bg-black selection:text-white">

            {/* Print / Download Bar */}
            <div className="fixed top-0 left-0 w-full p-4 flex justify-between bg-white border-b border-gray-200 print:hidden z-50">
                <a href="/" className="flex items-center gap-2 font-bold hover:text-gray-600">
                    ← Back to Portfolio
                </a>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800">
                    <Download className="w-4 h-4" /> Download PDF
                </button>
            </div>

            <div className="max-w-4xl mx-auto mt-16 print:mt-0">
                <header className="text-center mb-12 border-b-2 border-black pb-8">
                    <h1 className="text-5xl font-black uppercase mb-4 tracking-tighter">Ayaan Alam</h1>
                    <div className="text-sm font-mono text-gray-600 space-y-1">
                        <p>Bengaluru, India • +91-9711225837 • ayaanalam78670@gmail.com</p>
                        <div className="flex justify-center gap-4">
                            <a href="https://github.com/ayaan07alam" className="underline">github.com/ayaan07alam</a>
                            <a href="https://linkedin.com/in/ayaan07alam" className="underline">linkedin.com/in/ayaan07alam</a>
                        </div>
                    </div>
                </header>

                <section className="mb-8">
                    <h2 className="text-lg font-black uppercase border-b border-gray-300 pb-2 mb-4">Professional Summary</h2>
                    <p className="text-gray-800 leading-relaxed">
                        Software Development Engineer with hands-on experience in <span className="font-bold">Java, Spring Boot, RESTful APIs, SQL, and scalable backend systems</span>.
                        Proven track record of building production-ready EdTech platforms, job portals, and CRM applications.
                        Skilled in API design, authentication, system optimization, Agile development, and performance tuning.
                        Seeking SDE / Backend / MTS roles in product-driven teams.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-black uppercase border-b border-gray-300 pb-2 mb-4">Technical Skills</h2>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        <p><span className="font-bold">Languages:</span> Java, JavaScript, Python, C++, PHP</p>
                        <p><span className="font-bold">Backend:</span> Spring Boot, Spring Security, REST APIs, Hibernate/JPA, JWT, OAuth</p>
                        <p><span className="font-bold">Frontend:</span> React.js, Next.js, HTML5, CSS3, Tailwind CSS</p>
                        <p><span className="font-bold">Databases:</span> PostgreSQL, MySQL, MongoDB, SQLite</p>
                        <p><span className="font-bold">Cloud/Tools:</span> AWS, Docker, Git, Maven, Postman, Jira, Linux</p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-black uppercase border-b border-gray-300 pb-2 mb-4">Experience</h2>

                    <div className="mb-6">
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="font-bold text-lg">Intellipaat Software Solutions</h3>
                            <span className="font-mono text-sm text-gray-600">Jan 2025 – Present</span>
                        </div>
                        <p className="italic text-sm text-gray-700 mb-3">Technical Research Analyst (SDE – Platform)</p>
                        <ul className="list-disc list-outside ml-4 text-sm space-y-1 text-gray-800">
                            <li>Developed and maintained backend services and RESTful APIs using <span className="font-bold">Java and Spring Boot</span>.</li>
                            <li>Designed scalable API architecture for LMS workflows. Optimized database features with PostgreSQL.</li>
                            <li>Improved SEO and Core Web Vitals, enhancing page load speed.</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="font-bold text-lg">GeeksforGeeks</h3>
                            <span className="font-mono text-sm text-gray-600">Nov 2023 – Oct 2024</span>
                        </div>
                        <p className="italic text-sm text-gray-700 mb-3">Member of Technical Staff (MTS)</p>
                        <ul className="list-disc list-outside ml-4 text-sm space-y-1 text-gray-800">
                            <li>Contributed to high-traffic learning platforms serving millions of monthly users.</li>
                            <li>Built React-based UI components and improved frontend performance by <span className="font-bold">30%</span>.</li>
                            <li>Integrated REST APIs for course data, mentor systems, and payment workflows.</li>
                        </ul>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-black uppercase border-b border-gray-300 pb-2 mb-4">Projects</h2>

                    <div className="mb-4">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold">Developer Learning Platform (runtimeriver.com)</h3>
                        </div>
                        <ul className="list-disc list-outside ml-4 text-sm mt-2 text-gray-800">
                            <li>Built full-stack job/learning platform with <span className="font-bold">Spring Boot, Next.js, and PostgreSQL</span>.</li>
                            <li>Implemented JWT auth and Google OAuth. Deployed with production hosting.</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold">CRM Application</h3>
                        </div>
                        <ul className="list-disc list-outside ml-4 text-sm mt-2 text-gray-800">
                            <li>Secure CRM backend with role-based auth and scalable REST APIs using Spring Boot.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-black uppercase border-b border-gray-300 pb-2 mb-4">Education</h2>
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-bold">Guru Gobind Singh Indraprastha University</h3>
                        <span className="font-mono text-sm">2020 – 2024</span>
                    </div>
                    <p className="text-sm">B.Tech – Information Technology | CGPA: 9.1</p>
                </section>

            </div>
        </div>
    );
}
