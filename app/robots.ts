import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ayaan-alam.vercel.app';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/', // Disallow admin routes
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
