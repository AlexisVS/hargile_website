export default function manifest() {
    return {
        name: 'HARGILE presentation site',
        short_name: 'HARGILE presentation site',
        description: 'HARGILE presentation site',
        start_url: '/',
        display: 'standalone',
        background_color: '#fff',
        theme_color: '#fff',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
