export interface InitialEpisodeData {
    number: number;
    title: string;
    description: string;
    youtubeUrl: string;
    videoUrl?: string;
    durationSeconds?: number;
    isFree: boolean;
}

export interface InitialDramaData {
    id: string;
    title: string;
    slug: string;
    synopsis: string;
    coverUrl: string;
    bannerUrl?: string;
    category: string;
    tags: string;
    totalEpisodes: number;
    freeEpisodesCount: number;
    isFeatured: boolean;
    isVertical: boolean;
    viewsCount: number;
    likesCount: number;
    episodes: InitialEpisodeData[];
}

export const INITIAL_YOUTUBE_DRAMAS: InitialDramaData[] = [
    {
        "id": "tdx-ganhei-tres-namoradas",
        "title": "Ganhei Três Namoradas",
        "slug": "ganhei-tres-namoradas",
        "synopsis": "Preso em uma realidade brutal inspirada na antiga Esparta, Jason é um pária da sociedade que toma uma decisão leal ao ficar ao lado de três garotas rejeitadas. Sua atitude desperta um sistema misterioso que o recompensa com armas modernas e tecnológicas conforme o vínculo de afeto entre eles aumenta. Em um mundo de espadas e exércitos impiedosos, eles se tornam uma força imparável.",
        "coverUrl": "/cover-ganhei-tres-namoradas.jpg",
        "bannerUrl": "/cover-ganhei-tres-namoradas.jpg",
        "category": "Legendado",
        "tags": "legendado,fantasia,acao,romance,esparta,armas,destaques,em alta",
        "totalEpisodes": 60,
        "freeEpisodesCount": 2,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 5200000,
        "likesCount": 49200,
        "episodes": [
            {
                "number": 1,
                "title": "Episódio 1",
                "description": "Episódio 1 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Episódio 2",
                "description": "Episódio 2 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": true
            },
            {
                "number": 3,
                "title": "Episódio 3",
                "description": "Episódio 3 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Episódio 4",
                "description": "Episódio 4 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Episódio 5",
                "description": "Episódio 5 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Episódio 6",
                "description": "Episódio 6 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Episódio 7",
                "description": "Episódio 7 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Episódio 8",
                "description": "Episódio 8 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Episódio 9",
                "description": "Episódio 9 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Episódio 10",
                "description": "Episódio 10 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Episódio 11",
                "description": "Episódio 11 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Episódio 12",
                "description": "Episódio 12 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Episódio 13",
                "description": "Episódio 13 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Episódio 14",
                "description": "Episódio 14 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Episódio 15",
                "description": "Episódio 15 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Episódio 16",
                "description": "Episódio 16 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Episódio 17",
                "description": "Episódio 17 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Episódio 18",
                "description": "Episódio 18 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Episódio 19",
                "description": "Episódio 19 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Episódio 20",
                "description": "Episódio 20 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Episódio 21",
                "description": "Episódio 21 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Episódio 22",
                "description": "Episódio 22 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Episódio 23",
                "description": "Episódio 23 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 24,
                "title": "Episódio 24",
                "description": "Episódio 24 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 25,
                "title": "Episódio 25",
                "description": "Episódio 25 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 26,
                "title": "Episódio 26",
                "description": "Episódio 26 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 27,
                "title": "Episódio 27",
                "description": "Episódio 27 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 28,
                "title": "Episódio 28",
                "description": "Episódio 28 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 29,
                "title": "Episódio 29",
                "description": "Episódio 29 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 30,
                "title": "Episódio 30",
                "description": "Episódio 30 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 31,
                "title": "Episódio 31",
                "description": "Episódio 31 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 32,
                "title": "Episódio 32",
                "description": "Episódio 32 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 33,
                "title": "Episódio 33",
                "description": "Episódio 33 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 34,
                "title": "Episódio 34",
                "description": "Episódio 34 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 35,
                "title": "Episódio 35",
                "description": "Episódio 35 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 36,
                "title": "Episódio 36",
                "description": "Episódio 36 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 37,
                "title": "Episódio 37",
                "description": "Episódio 37 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 38,
                "title": "Episódio 38",
                "description": "Episódio 38 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 39,
                "title": "Episódio 39",
                "description": "Episódio 39 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 40,
                "title": "Episódio 40",
                "description": "Episódio 40 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 41,
                "title": "Episódio 41",
                "description": "Episódio 41 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 42,
                "title": "Episódio 42",
                "description": "Episódio 42 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 43,
                "title": "Episódio 43",
                "description": "Episódio 43 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 44,
                "title": "Episódio 44",
                "description": "Episódio 44 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 45,
                "title": "Episódio 45",
                "description": "Episódio 45 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 46,
                "title": "Episódio 46",
                "description": "Episódio 46 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 47,
                "title": "Episódio 47",
                "description": "Episódio 47 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 48,
                "title": "Episódio 48",
                "description": "Episódio 48 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 49,
                "title": "Episódio 49",
                "description": "Episódio 49 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 50,
                "title": "Episódio 50",
                "description": "Episódio 50 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 51,
                "title": "Episódio 51",
                "description": "Episódio 51 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 52,
                "title": "Episódio 52",
                "description": "Episódio 52 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 53,
                "title": "Episódio 53",
                "description": "Episódio 53 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 54,
                "title": "Episódio 54",
                "description": "Episódio 54 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 55,
                "title": "Episódio 55",
                "description": "Episódio 55 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 56,
                "title": "Episódio 56",
                "description": "Episódio 56 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 57,
                "title": "Episódio 57",
                "description": "Episódio 57 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 58,
                "title": "Episódio 58",
                "description": "Episódio 58 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 59,
                "title": "Episódio 59",
                "description": "Episódio 59 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            },
            {
                "number": 60,
                "title": "Episódio 60",
                "description": "Episódio 60 de Ganhei Três Namoradas completo e legendado em alta definição.",
                "youtubeUrl": "https://www.youtube.com/watch?v=K5aKv-9gR28",
                "videoUrl": "https://big-stream-player.lovable.app/api/public/video/7a83e8c6-6715-40bf-b1db-9dd46e40a8f8",
                "durationSeconds": 150,
                "isFree": false
            }
        ]
    },
        {
        "id": "tdx-xiu-somos-um-secreto",
        "title": "Xiu... Somos Um Secreto",
        "slug": "xiu-somos-um-secreto",
        "synopsis": "Em um mundo onde a lealdade entra em conflito com a tentação, um herdeiro rebelde e sua meia-irmã recém-chegada enfrentam disputas pelo poder, traições familiares e um romance proibido — arriscando tudo para proteger seus segredos um ao outro.",
        "coverUrl": "https://i.ytimg.com/vi/FNBTJfCnpnw/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/FNBTJfCnpnw/maxresdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,romance,bilionario,mafia,vinganca,destaques,top1",
        "totalEpisodes": 36,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 4850000,
        "likesCount": 38450,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Parte 23",
                "description": "Episódio 23 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 24,
                "title": "Parte 24",
                "description": "Episódio 24 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 25,
                "title": "Parte 25",
                "description": "Episódio 25 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 26,
                "title": "Parte 26",
                "description": "Episódio 26 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 27,
                "title": "Parte 27",
                "description": "Episódio 27 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 28,
                "title": "Parte 28",
                "description": "Episódio 28 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 29,
                "title": "Parte 29",
                "description": "Episódio 29 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 30,
                "title": "Parte 30",
                "description": "Episódio 30 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 31,
                "title": "Parte 31",
                "description": "Episódio 31 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 32,
                "title": "Parte 32",
                "description": "Episódio 32 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 33,
                "title": "Parte 33",
                "description": "Episódio 33 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 34,
                "title": "Parte 34",
                "description": "Episódio 34 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 35,
                "title": "Parte 35",
                "description": "Episódio 35 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            },
            {
                "number": 36,
                "title": "Parte 36",
                "description": "Episódio 36 de Xiu... Somos Um Secreto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FNBTJfCnpnw",
                "durationSeconds": 119,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-uma-aposta-de-amor-ou-morte",
        "title": "Uma Aposta de Amor ou Morte",
        "slug": "uma-aposta-de-amor-ou-morte",
        "synopsis": "Em um jogo arriscado onde o coração é o prêmio e a vida é a aposta, dois rivais são forçados a conviver sob o mesmo teto, descobrindo segredos obscuros e uma atração avassaladora que pode destruir a ambos.",
        "coverUrl": "https://i.ytimg.com/vi/cZv0c3goDac/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/cZv0c3goDac/maxresdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,romance,mafia,vinganca",
        "totalEpisodes": 38,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 3920000,
        "likesCount": 15313,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Parte 23",
                "description": "Episódio 23 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 24,
                "title": "Parte 24",
                "description": "Episódio 24 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 25,
                "title": "Parte 25",
                "description": "Episódio 25 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 26,
                "title": "Parte 26",
                "description": "Episódio 26 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 27,
                "title": "Parte 27",
                "description": "Episódio 27 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 28,
                "title": "Parte 28",
                "description": "Episódio 28 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 29,
                "title": "Parte 29",
                "description": "Episódio 29 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 30,
                "title": "Parte 30",
                "description": "Episódio 30 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 31,
                "title": "Parte 31",
                "description": "Episódio 31 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 32,
                "title": "Parte 32",
                "description": "Episódio 32 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 33,
                "title": "Parte 33",
                "description": "Episódio 33 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 34,
                "title": "Parte 34",
                "description": "Episódio 34 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 35,
                "title": "Parte 35",
                "description": "Episódio 35 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 36,
                "title": "Parte 36",
                "description": "Episódio 36 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 37,
                "title": "Parte 37",
                "description": "Episódio 37 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 38,
                "title": "Parte 38",
                "description": "Episódio 38 de Uma Aposta de Amor ou Morte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cZv0c3goDac",
                "durationSeconds": 199,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-sequestrada-pela-mafia",
        "title": "Sequestrada pela Máfia",
        "slug": "sequestrada-pela-mafia",
        "synopsis": "Capturada pelo chefe da família mafiosa mais temida da cidade, ela descobre que o homem que jurou mantê-la refém guarda segredos que ligam seus passados — e um desejo perigoso capaz de mudar seu destino para sempre.",
        "coverUrl": "https://i.ytimg.com/vi/B9pxrOkhQps/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/B9pxrOkhQps/maxresdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,mafia,sequestro,romance,destaques,top1",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 42000,
        "likesCount": 1195250,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Sequestrada pela Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/B9pxrOkhQps",
                "durationSeconds": 1200,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Sequestrada pela Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9ANqOMe5IIc",
                "durationSeconds": 1726,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-herdeira-bilionaria-confronta-seu-marido-assassino",
        "title": "Herdeira Bilionária Confronta Seu Marido Assassino",
        "slug": "herdeira-bilionaria-confronta-seu-marido-assassino",
        "synopsis": "Após descobrir a conspiração letal tramada por seu próprio marido, uma herdeira de bilhões forja a própria fraqueza para desmascará-lo friamente em um confronto de vingança sem precedentes.",
        "coverUrl": "https://i.ytimg.com/vi/8Kqxta_ALzE/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/8Kqxta_ALzE/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bombando,bilionario,vinganca,herdeira,traicao,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 38000,
        "likesCount": 235378,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Herdeira Bilionária Confronta Seu Marido Assassino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8Kqxta_ALzE",
                "durationSeconds": 676,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Herdeira Bilionária Confronta Seu Marido Assassino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UJExg6Dy9yE",
                "durationSeconds": 1097,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Herdeira Bilionária Confronta Seu Marido Assassino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vxjXAWbC0pM",
                "durationSeconds": 671,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-vinganca-da-herdeira-descartada",
        "title": "A Vingança da Herdeira Descartada",
        "slug": "a-vinganca-da-herdeira-descartada",
        "synopsis": "Desprezada, expulsa e dada como derrotada por sua família egoísta, a legítima herdeira retorna triunfante, detendo o poder absoluto para recuperar o império que sempre foi seu por direito.",
        "coverUrl": "https://i.ytimg.com/vi/6UHsi-m-9uU/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/6UHsi-m-9uU/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bombando,vinganca,herdeira,bilionario,drama,destaques",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 35000,
        "likesCount": 185395,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Vingança da Herdeira Descartada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6UHsi-m-9uU",
                "durationSeconds": 891,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Vingança da Herdeira Descartada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Q5TvMwCAxj0",
                "durationSeconds": 1541,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Vingança da Herdeira Descartada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/j-KYMUEZHD4",
                "durationSeconds": 988,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-da-favela-ao-trono",
        "title": "Da Favela ao Trono",
        "slug": "da-favela-ao-trono",
        "synopsis": "Nascido nas vielas e moldado pelas dificuldades, um jovem determinado desafia todas as probabilidades e preconceitos para conquistar o topo da alta sociedade e o respeito que sempre mereceu.",
        "coverUrl": "https://i.ytimg.com/vi/54QkzeojpI0/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/54QkzeojpI0/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,superacao,favela,trono,sucesso,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31000,
        "likesCount": 153300,
        "episodes": [
            {
                "number": 1,
                "title": "Episódio Completo",
                "description": "Episódio 1 de Da Favela ao Trono completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/54QkzeojpI0",
                "durationSeconds": 750,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-agora-podem-beijar-a-noiva",
        "title": "Agora Podem Beijar a Noiva...",
        "slug": "agora-podem-beijar-a-noiva",
        "synopsis": "Em pleno altar, diante da alta sociedade, uma revelação bombástica interrompe a cerimônia e transforma o casamento dos sonhos em um jogo ardiloso de traições, ciúmes e segredos expostos.",
        "coverUrl": "https://i.ytimg.com/vi/wOkl8fAKdGo/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/wOkl8fAKdGo/maxresdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,casamento,romance,traicao,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 29000,
        "likesCount": 91000,
        "episodes": [
            {
                "number": 1,
                "title": "Episódio Completo",
                "description": "Episódio 1 de Agora Podem Beijar a Noiva... completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wOkl8fAKdGo",
                "durationSeconds": 670,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-nao-mexa-com-a-minha-irma",
        "title": "Não Mexa com a Minha Irmã",
        "slug": "nao-mexa-com-a-minha-irma",
        "synopsis": "Quando forças perigosas ameaçam a integridade da sua família, um irmão implacável cruza todos os limites da lei para proteger quem ama e destruir cada um dos seus algozes.",
        "coverUrl": "https://i.ytimg.com/vi/DMzpI0AZAcc/hqdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/DMzpI0AZAcc/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,protecao,familia,vinganca,drama,acao",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 28000,
        "likesCount": 90650,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Não Mexa com a Minha Irmã completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DMzpI0AZAcc",
                "durationSeconds": 1505,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Não Mexa com a Minha Irmã completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/oNJGtIGlddc",
                "durationSeconds": 1419,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-forcada-a-tornar-se-noiva-de-um-chefe-gangster-contrato-de-amor",
        "title": "Forçada a Tornar-se Noiva de um Chefe Gangster: Contrato de Amor",
        "slug": "forcada-a-tornar-se-noiva-de-um-chefe-gangster-contrato-de-amor",
        "synopsis": "Para salvar sua família da ruína total, uma jovem inocente assina um contrato irrevogável com o líder mais impiedoso do submundo, dando início a uma convivência carregada de tensão e paixão proibida.",
        "coverUrl": "https://i.ytimg.com/vi/15E9emKLxIE/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/15E9emKLxIE/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,mafia,gangster,contrato,casamento-forcado,romance",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 27000,
        "likesCount": 88900,
        "episodes": [
            {
                "number": 1,
                "title": "Episódio Completo",
                "description": "Episódio 1 de Forçada a Tornar-se Noiva de um Chefe Gangster: Contrato de Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/15E9emKLxIE",
                "durationSeconds": 1462,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-um-encontro-as-cegas-com-o-meu-destino",
        "title": "Um Encontro às Cegas com o Meu Destino",
        "slug": "um-encontro-as-cegas-com-o-meu-destino",
        "synopsis": "O que era para ser apenas um encontro às cegas despretensioso coloca frente a frente duas pessoas unidas por um destino inevitável, faíscas imediatas e revelações inesperadas.",
        "coverUrl": "https://i.ytimg.com/vi/-0J9VOavSeA/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/-0J9VOavSeA/maxresdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,encontro-as-cegas,destino,romance,comedia-romantica,ceo",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 26000,
        "likesCount": 87150,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Um Encontro às Cegas com o Meu Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-0J9VOavSeA",
                "durationSeconds": 1358,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Um Encontro às Cegas com o Meu Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0Gs3GuXqkGA",
                "durationSeconds": 1367,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-destino-selado-pacto-com-o-rei-da-mafia",
        "title": "Destino Selado: Pacto com o Rei da Máfia",
        "slug": "destino-selado-pacto-com-o-rei-da-mafia",
        "synopsis": "Sem alternativas para escapar de uma ameaça mortal, ela aceita um pacto de sangue com o soberano da máfia, tornando-se sua protegida em troca de uma lealdade que testará seu coração.",
        "coverUrl": "https://i.ytimg.com/vi/WNtA6CGE790/hqdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/WNtA6CGE790/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,mafia,pacto,rei-da-mafia,romance-proibido,perigo",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 25000,
        "likesCount": 77595,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Destino Selado: Pacto com o Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WNtA6CGE790",
                "durationSeconds": 1064,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Destino Selado: Pacto com o Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/TQ-5fmSDQbI",
                "durationSeconds": 1029,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Destino Selado: Pacto com o Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gWvqd-8-rvI",
                "durationSeconds": 673,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-ceo-que-sentiu-minha-gravidez",
        "title": "O CEO que Sentiu Minha Gravidez",
        "slug": "o-ceo-que-sentiu-minha-gravidez",
        "synopsis": "Após uma noite inesquecível e misteriosa, um CEO poderoso e reservado descobre a gravidez oculta da mulher que nunca conseguiu esquecer, iniciando uma busca frenética por seu herdeiro.",
        "coverUrl": "https://i.ytimg.com/vi/Qgfn7KkK6mc/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/Qgfn7KkK6mc/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,ceo,gravidez,bebe-secreto,bilionario,romance",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 24000,
        "likesCount": 68950,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O CEO que Sentiu Minha Gravidez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Qgfn7KkK6mc",
                "durationSeconds": 1162,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O CEO que Sentiu Minha Gravidez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OSqWqLPAP3Q",
                "durationSeconds": 1174,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-limite-do-amor",
        "title": "O Limite do Amor",
        "slug": "o-limite-do-amor",
        "synopsis": "Até onde alguém é capaz de ir em nome da paixão? Quando o orgulho e as convenções sociais colidem, dois corações intensos descobrem que o verdadeiro amor não conhece limites.",
        "coverUrl": "https://i.ytimg.com/vi/4RMTES4Yddk/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/4RMTES4Yddk/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,limite-do-amor,romance,paixao,drama,emocao",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 23000,
        "likesCount": 64750,
        "episodes": [
            {
                "number": 1,
                "title": "Episódio Completo",
                "description": "Episódio 1 de O Limite do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4RMTES4Yddk",
                "durationSeconds": 2195,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-nao-desafie-a-senhora-bilionaria",
        "title": "Não Desafie a Senhora Bilionária",
        "slug": "nao-desafie-a-senhora-bilionaria",
        "synopsis": "Aqueles que a julgaram apenas uma mulher indefesa cometem o pior erro de suas vidas ao descobrir que por trás de seu olhar sereno está a mais temida e influente senhora de um império bilionário.",
        "coverUrl": "https://i.ytimg.com/vi/qHmU2FchRns/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/qHmU2FchRns/maxresdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bilionario,mulher-forte,vinganca,luxo,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 22000,
        "likesCount": 57645,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Não Desafie a Senhora Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qHmU2FchRns",
                "durationSeconds": 654,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Não Desafie a Senhora Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uBpAYHOew2I",
                "durationSeconds": 1470,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-encontrei-meu-papai-na-obra",
        "title": "Encontrei Meu Papai na Obra",
        "slug": "encontrei-meu-papai-na-obra",
        "synopsis": "Durante uma visita inesperada a um canteiro de obras, uma garotinha de olhos brilhantes reconhece na figura de um trabalhador humilde o homem que é secretamente o homem mais rico do país.",
        "coverUrl": "https://i.ytimg.com/vi/jfCMBB51J3I/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/jfCMBB51J3I/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,familia,filha,papai-secreto,emocionante,drama,bilionario-disfarcado",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 21000,
        "likesCount": 54040,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Encontrei Meu Papai na Obra completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jfCMBB51J3I",
                "durationSeconds": 1200,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Encontrei Meu Papai na Obra completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qyNFetLqMMQ",
                "durationSeconds": 1187,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Encontrei Meu Papai na Obra completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1Q1M6tzdK2k",
                "durationSeconds": 1051,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-casei-com-o-ceo-que-trai-por-detras-das-mentiras-existe-o-amor",
        "title": "Casei com o CEO que Traí: Por Detrás das Mentiras, Existe o Amor",
        "slug": "casei-com-o-ceo-que-trai-por-detras-das-mentiras-existe-o-amor",
        "synopsis": "Marcada pela culpa e envolvida em uma rede de enganos, ela se une em matrimônio ao CEO que no passado prejudicou, descobrindo que sob a frieza de seu olhar ainda arde um amor inextinguível.",
        "coverUrl": "https://i.ytimg.com/vi/rUqxsSHFHjg/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/rUqxsSHFHjg/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,ceo,casamento,mentiras,perdao,romance,redencao",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 20000,
        "likesCount": 53200,
        "episodes": [
            {
                "number": 1,
                "title": "Episódio Completo",
                "description": "Episódio 1 de Casei com o CEO que Traí: Por Detrás das Mentiras, Existe o Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rUqxsSHFHjg",
                "durationSeconds": 1529,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-amor-entre-segredos",
        "title": "Amor Entre Segredos",
        "slug": "amor-entre-segredos",
        "synopsis": "Em um círculo de aparências e alta sofisticação, segredos guardados a sete chaves ameaçam vir à tona quando uma paixão avassaladora desafia as mentiras que sustentavam suas vidas.",
        "coverUrl": "https://i.ytimg.com/vi/zR0beyCx4I8/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/zR0beyCx4I8/maxresdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,segredos,romance,enredo-envolvente,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 19000,
        "likesCount": 45150,
        "episodes": [
            {
                "number": 1,
                "title": "Episódio Completo",
                "description": "Episódio 1 de Amor Entre Segredos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zR0beyCx4I8",
                "durationSeconds": 865,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-papai-malvado-voce-ta-frito",
        "title": "Papai Malvado, Você Tá Frito!",
        "slug": "papai-malvado-voce-ta-frito",
        "synopsis": "Determinada a vingar sua mãe e colocar juízo na cabeça do pai magnata que a abandonou, uma criança genial apronta todas as armadilhas para domar o coração do poderoso CEO.",
        "coverUrl": "https://i.ytimg.com/vi/KFXLb8kWfF0/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/KFXLb8kWfF0/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,familia,filho-esperto,ceo,comedia-romantica,reconciliacao",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 18500,
        "likesCount": 35140,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Papai Malvado, Você Tá Frito! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/KFXLb8kWfF0",
                "durationSeconds": 881,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Papai Malvado, Você Tá Frito! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BUPFrp_5Cls",
                "durationSeconds": 868,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-genio-de-rua-que-salvou-meu-imperio",
        "title": "O Gênio de Rua que Salvou Meu Império",
        "slug": "o-genio-de-rua-que-salvou-meu-imperio",
        "synopsis": "Quando a maior corporação da cidade estava à beira do colapso econômico por traição interna, a mente brilhante de um jovem das ruas se torna a única esperança de salvação do império.",
        "coverUrl": "https://i.ytimg.com/vi/4eRwbUYL7W8/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/4eRwbUYL7W8/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,genio,imperio,bilionario,negocios,superacao,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 18000,
        "likesCount": 32550,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Gênio de Rua que Salvou Meu Império completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4eRwbUYL7W8",
                "durationSeconds": 1292,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Gênio de Rua que Salvou Meu Império completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Yg7kGqNPxpc",
                "durationSeconds": 1260,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-dama-chefe-da-traida-a-amada",
        "title": "A Dama Chefe: Da Traída à Amada",
        "slug": "a-dama-chefe-da-traida-a-amada",
        "synopsis": "Humilhada e traída por aqueles em quem mais confiava, ela ressurge no comando dos negócios como uma dama de ferro imbatível, conquistando a admiração e o amor do homem mais cobiçado da cidade.",
        "coverUrl": "https://i.ytimg.com/vi/gj73fT37Ff4/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/gj73fT37Ff4/maxresdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,dama-chefe,traicao,volta-por-cima,mulher-no-comando,romance",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 17500,
        "likesCount": 28350,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Dama Chefe: Da Traída à Amada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gj73fT37Ff4",
                "durationSeconds": 1167,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Dama Chefe: Da Traída à Amada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XqjVNN9Db-M",
                "durationSeconds": 753,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-mamae-eu-trouxe-o-papai-pra-te-salvar",
        "title": "Mamãe, Eu Trouxe o Papai pra Te Salvar!",
        "slug": "mamae-eu-trouxe-o-papai-pra-te-salvar",
        "synopsis": "Cansado de ver sua mãe sofrer injustiças, um menininho corajoso vai até a sede da maior empresa do país para trazer o pai bilionário de volta e salvar a família de uma vez por todas.",
        "coverUrl": "https://i.ytimg.com/vi/Pe8Eh0emakM/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/Pe8Eh0emakM/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,crianca-fofa,papai-salvador,resgate,reconciliacao,romance",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 17000,
        "likesCount": 27650,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Mamãe, Eu Trouxe o Papai pra Te Salvar! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Pe8Eh0emakM",
                "durationSeconds": 1531,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Mamãe, Eu Trouxe o Papai pra Te Salvar! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YUqXbD_ijxo",
                "durationSeconds": 1389,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-vinganca-elegante-de-uma-mae-bilionaria",
        "title": "Vingança Elegante de uma Mãe Bilionária",
        "slug": "vinganca-elegante-de-uma-mae-bilionaria",
        "synopsis": "Com classe, inteligência afiada e recursos ilimitados, uma mãe bilionária arquiteta a vingança perfeita contra aqueles que conspiraram contra seu sangue, sem derramar uma única lágrima em vão.",
        "coverUrl": "https://i.ytimg.com/vi/uaaOa_WTIO0/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/uaaOa_WTIO0/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,mae-bilionaria,vinganca,luxo,poder,justica",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 16500,
        "likesCount": 26600,
        "episodes": [
            {
                "number": 1,
                "title": "Episódio Completo",
                "description": "Episódio 1 de Vingança Elegante de uma Mãe Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uaaOa_WTIO0",
                "durationSeconds": 1744,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-o-100-divorcio-foi-o-seu-maior-erro",
        "title": "O 100º Divórcio Foi o Seu Maior Erro",
        "slug": "o-100-divorcio-foi-o-seu-maior-erro",
        "synopsis": "Ele acreditava que o divórcio seria apenas mais uma formalidade em sua rotina de negócios, mas percebe o tamanho do seu erro no instante em que sua ex-esposa se torna a mulher mais disputada do país.",
        "coverUrl": "https://i.ytimg.com/vi/VgOkf39MsGQ/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/VgOkf39MsGQ/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,divorcio,arrependimento,reconquista,drama-conjugal,romance",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 16000,
        "likesCount": 25340,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O 100º Divórcio Foi o Seu Maior Erro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VgOkf39MsGQ",
                "durationSeconds": 1500,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O 100º Divórcio Foi o Seu Maior Erro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_IY5igl_FKY",
                "durationSeconds": 782,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-caminho-para-a-liberdade",
        "title": "Caminho para a Liberdade",
        "slug": "caminho-para-a-liberdade",
        "synopsis": "Um vislumbre emocionante de superação e coragem onde cada segundo conta na luta de uma alma valente para quebrar as correntes da opressão e alcançar a tão sonhada liberdade.",
        "coverUrl": "https://i.ytimg.com/vi/5ih5sVRjMto/hqdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/5ih5sVRjMto/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,liberdade,emocao,curta,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 15500,
        "likesCount": 24500,
        "episodes": [
            {
                "number": 1,
                "title": "Episódio Completo",
                "description": "Episódio 1 de Caminho para a Liberdade completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5ih5sVRjMto",
                "durationSeconds": 193,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-caso-encerrado-o-retorno-da-rainha-do-direito",
        "title": "Caso Encerrado: O Retorno da Rainha do Direito",
        "slug": "caso-encerrado-o-retorno-da-rainha-do-direito",
        "synopsis": "Conhecida por sua mente cirúrgica nos tribunais, a mais brilhante advogada da nação retorna após anos afastada para assumir o caso mais perigoso da sua carreira e restabelecer a verdade.",
        "coverUrl": "https://i.ytimg.com/vi/7ogXC5oUWhY/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/7ogXC5oUWhY/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,advogada,tribunal,retorno-triunfal,justica,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 15000,
        "likesCount": 23800,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Caso Encerrado: O Retorno da Rainha do Direito completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7ogXC5oUWhY",
                "durationSeconds": 1259,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Caso Encerrado: O Retorno da Rainha do Direito completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_aGao4zEHYA",
                "durationSeconds": 1254,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-casamento-acidental-com-meu-ceo-pobre",
        "title": "Casamento Acidental com Meu CEO Pobre",
        "slug": "casamento-acidental-com-meu-ceo-pobre",
        "synopsis": "Um engano cômico e inesperado a leva ao altar com um homem aparentemente simples, sem desconfiar que seu novo marido é, na realidade, o herdeiro bilionário da maior fortuna da região.",
        "coverUrl": "https://i.ytimg.com/vi/WNpVrurQmy8/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/WNpVrurQmy8/maxresdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,casamento-acidental,ceo-disfarcado,identidade-secreta,comedia-romantica",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 14500,
        "likesCount": 19600,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Casamento Acidental com Meu CEO Pobre completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WNpVrurQmy8",
                "durationSeconds": 984,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Casamento Acidental com Meu CEO Pobre completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QulRRUQfKlg",
                "durationSeconds": 944,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Casamento Acidental com Meu CEO Pobre completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OfcNKbKnabw",
                "durationSeconds": 634,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-depois-do-termino-casei-com-o-chefao-da-mafia",
        "title": "Depois do Término, Casei com o Chefão da Máfia",
        "slug": "depois-do-termino-casei-com-o-chefao-da-mafia",
        "synopsis": "Logo após ser covardemente descartada por seu ex-noivo arrogante, ela cruza o caminho do chefão da máfia, que lhe oferece sua proteção total, seu império e um casamento irresistível.",
        "coverUrl": "https://i.ytimg.com/vi/VqCyItFZG2U/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/VqCyItFZG2U/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,termino,chefao-da-mafia,casamento-inesperado,protecao,perigo",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 14000,
        "likesCount": 17290,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Depois do Término, Casei com o Chefão da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VqCyItFZG2U",
                "durationSeconds": 1394,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Depois do Término, Casei com o Chefão da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XFg40Z9eSis",
                "durationSeconds": 1392,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-ele-arranjou-uma-amante-e-eu-conquistei-o-ceu",
        "title": "Ele Arranjou Uma Amante E Eu Conquistei o Céu",
        "slug": "ele-arranjou-uma-amante-e-eu-conquistei-o-ceu",
        "synopsis": "Enquanto o marido tolo desfilava publicamente com sua amante fútil, a esposa menosprezada assumia o controle absoluto do mercado internacional, conquistando o mundo com sua genialidade.",
        "coverUrl": "https://i.ytimg.com/vi/Yc7eG2Zldmw/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/Yc7eG2Zldmw/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,amante,traicao,sucesso-feminino,volta-por-cima,vinganca",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 13500,
        "likesCount": 17150,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Ele Arranjou Uma Amante E Eu Conquistei o Céu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Yc7eG2Zldmw",
                "durationSeconds": 1654,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Ele Arranjou Uma Amante E Eu Conquistei o Céu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/y2GWDfmaXTY",
                "durationSeconds": 1640,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-mae-solteira-casa-acidentalmente-com-bilionario-enquanto-procura-crianca-desapar",
        "title": "Mãe Solteira Casa Acidentalmente com Bilionário Enquanto Procura Criança Desaparecida",
        "slug": "mae-solteira-casa-acidentalmente-com-bilionario-enquanto-procura-crianca-desapar",
        "synopsis": "Em busca desesperada por pistas de seu filho desaparecido, uma mãe corajosa acaba selando um matrimônio de conveniência com um bilionário que guarda as respostas que ela tanto procura.",
        "coverUrl": "https://i.ytimg.com/vi/LOe6IbAwnyg/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/LOe6IbAwnyg/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,mae-solteira,bilionario,busca,filho-desaparecido,destino",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 13000,
        "likesCount": 16800,
        "episodes": [
            {
                "number": 1,
                "title": "Episódio Completo",
                "description": "Episódio 1 de Mãe Solteira Casa Acidentalmente com Bilionário Enquanto Procura Criança Desaparecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LOe6IbAwnyg",
                "durationSeconds": 898,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-papai-essa-crianca-nem-e-sua",
        "title": "Papai, Essa Criança Nem É Sua",
        "slug": "papai-essa-crianca-nem-e-sua",
        "synopsis": "Em meio a uma tempestade familiar de acusações e testes de DNA manipulados, uma revelação comovente prova que a verdadeira ligação entre pai e filho vai muito além do sangue.",
        "coverUrl": "https://i.ytimg.com/vi/lJpXnn91VsY/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/lJpXnn91VsY/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,paternidade,duvida,verdade,familia,revelacao",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 12500,
        "likesCount": 16438,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Papai, Essa Criança Nem É Sua completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lJpXnn91VsY",
                "durationSeconds": 961,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Papai, Essa Criança Nem É Sua completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bv-sLK1brxU",
                "durationSeconds": 490,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-ossos-marcados-pela-dor",
        "title": "Ossos Marcados pela Dor",
        "slug": "ossos-marcados-pela-dor",
        "synopsis": "Marcada pelas cicatrizes de um passado doloroso e injusto, ela encontra nos braços de um homem protetor e compreensivo a força necessária para curar as feridas da alma e recomeçar.",
        "coverUrl": "https://i.ytimg.com/vi/Q-HN04KztIY/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/Q-HN04KztIY/maxresdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,dor,superacao,passado-sombrio,amor-e-cura,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 12000,
        "likesCount": 16100,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Ossos Marcados pela Dor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Q-HN04KztIY",
                "durationSeconds": 1131,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Ossos Marcados pela Dor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VcWE48UT-Ds",
                "durationSeconds": 1170,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-meu-marido-motorista-e-um-magnata",
        "title": "Meu Marido Motorista é um Magnata",
        "slug": "meu-marido-motorista-e-um-magnata",
        "synopsis": "Ela pensava ter se casado com um humilde motorista de aplicativo para fugir da pressão familiar, até descobrir que o homem que dirige seu carro é o proprietário de todo o conglomerado.",
        "coverUrl": "https://i.ytimg.com/vi/jSGgseF3UfE/maxresdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/jSGgseF3UfE/maxresdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,marido-motorista,magnata-disfarcado,identidade-oculta,humildade,amor",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 11500,
        "likesCount": 15050,
        "episodes": [
            {
                "number": 1,
                "title": "Episódio Completo",
                "description": "Episódio 1 de Meu Marido Motorista é um Magnata completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jSGgseF3UfE",
                "durationSeconds": 1631,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-rainha-nao-amante",
        "title": "Rainha, Não Amante",
        "slug": "rainha-nao-amante",
        "synopsis": "Ela jamais aceitará viver à sombra de ninguém ou ser a segunda opção de um homem vaidoso: seu lugar sempre foi o trono de rainha soberana do seu próprio destino e império.",
        "coverUrl": "https://i.ytimg.com/vi/SV35hDfmO7o/hqdefault.jpg",
        "bannerUrl": "https://i.ytimg.com/vi/SV35hDfmO7o/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,rainha,amor-proprio,dignidade,poder-feminino,vinganca",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 11000,
        "likesCount": 14315,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Rainha, Não Amante completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SV35hDfmO7o",
                "durationSeconds": 975,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Rainha, Não Amante completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YNNl_qqdA7w",
                "durationSeconds": 1270,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Rainha, Não Amante completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ny3KY85pSGo",
                "durationSeconds": 845,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-refugio-perigoso",
        "title": "Refúgio Perigoso",
        "slug": "refugio-perigoso",
        "synopsis": "A noiva fugitiva Olivia encontra refúgio nos braços de Edward, um temido e impiedoso chefe da máfia que se torna seu protetor e sua maior obsessão.",
        "coverUrl": "https://img.youtube.com/vi/SKIMEY6-ly0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/SKIMEY6-ly0/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 1380000,
        "likesCount": 10632,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Refúgio Perigoso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SKIMEY6-ly0",
                "durationSeconds": 695,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Refúgio Perigoso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OZt5qLdu_sE",
                "durationSeconds": 540,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Refúgio Perigoso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-LRRoOu6aI0",
                "durationSeconds": 848,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Refúgio Perigoso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fFhxQI6y3wE",
                "durationSeconds": 1362,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Refúgio Perigoso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/S-nggtnvDNQ",
                "durationSeconds": 1358,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Refúgio Perigoso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/TxH1koO1-3w",
                "durationSeconds": 884,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Refúgio Perigoso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XViBnvTddR8",
                "durationSeconds": 682,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Refúgio Perigoso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6CDOMnKFhGI",
                "durationSeconds": 849,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Refúgio Perigoso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5z0E6naMn94",
                "durationSeconds": 634,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-corrida-para-o-meu-coracao",
        "title": "Corrida para o Meu Coração",
        "slug": "corrida-para-o-meu-coracao",
        "synopsis": "A adrenalina das pistas se mistura à paixão irresistível entre dois rivais que encontram na velocidade a cura para suas dores.",
        "coverUrl": "https://img.youtube.com/vi/QScWtqBd8F4/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/QScWtqBd8F4/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,romance,drama",
        "totalEpisodes": 22,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 2850000,
        "likesCount": 11249,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QScWtqBd8F4",
                "durationSeconds": 1329,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eBGUGMGiIy8",
                "durationSeconds": 697,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9CjjBJMLrn8",
                "durationSeconds": 239,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PAMRUyD7gA8",
                "durationSeconds": 896,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OERXp8bH8uw",
                "durationSeconds": 487,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/69pkl_ZoojI",
                "durationSeconds": 256,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/X2cpywRmP1A",
                "durationSeconds": 1406,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BVDjkP7axmU",
                "durationSeconds": 272,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VDQBbR945Lc",
                "durationSeconds": 459,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1Yu5REfH9-4",
                "durationSeconds": 413,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IBWwCRzWdR0",
                "durationSeconds": 869,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kcipJLPh_oI",
                "durationSeconds": 1021,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QB_kngOw9Bs",
                "durationSeconds": 986,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fvfBf1qc4bM",
                "durationSeconds": 975,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/oUnTovEvjzs",
                "durationSeconds": 1002,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7epssztR-l8",
                "durationSeconds": 730,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7Q0HUO9veuE",
                "durationSeconds": 1421,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wNVAbMeippc",
                "durationSeconds": 532,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eySzCC4QuC8",
                "durationSeconds": 546,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SRG-n4vzKEw",
                "durationSeconds": 983,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VVhXVZ9YPDo",
                "durationSeconds": 1013,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de Corrida para o Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SMehkSen-Xs",
                "durationSeconds": 490,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-minha-cura-comeca-com-ela",
        "title": "Minha Cura Começa com Ela",
        "slug": "minha-cura-comeca-com-ela",
        "synopsis": "Ferido pelo passado e desacreditado do amor, um homem poderoso descobre na gentileza e força de uma mulher o verdadeiro caminho para a redenção.",
        "coverUrl": "https://img.youtube.com/vi/ouyG-_dm86g/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ouyG-_dm86g/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bombando,tendencias,romance,drama",
        "totalEpisodes": 15,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 710000,
        "likesCount": 4259,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ouyG-_dm86g",
                "durationSeconds": 1142,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EDIZ-dSCcs8",
                "durationSeconds": 1137,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5nzT6noh3zo",
                "durationSeconds": 1274,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qaunJuAqKM4",
                "durationSeconds": 1014,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/g0tf1b-cYXM",
                "durationSeconds": 1082,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XilJu6-FOhI",
                "durationSeconds": 1171,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0-aTwQBQsXw",
                "durationSeconds": 1281,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/L6ixni7YbtQ",
                "durationSeconds": 1193,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xc-EQucTerk",
                "durationSeconds": 1193,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/35BQn5D4EVY",
                "durationSeconds": 1043,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Hu4R1jcRN_U",
                "durationSeconds": 1134,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CGVlETzgsFc",
                "durationSeconds": 1139,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rd8hmgZoN20",
                "durationSeconds": 1203,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/d9bnhksTy2w",
                "durationSeconds": 952,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Minha Cura Começa com Ela completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xupMPMQf2zA",
                "durationSeconds": 1116,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-retorno-do-sabio-implacavel",
        "title": "O Retorno do Sábio Implacável",
        "slug": "o-retorno-do-sabio-implacavel",
        "synopsis": "Um mestre supremo retorna dos confins do esquecimento com poderes ancestrais para recuperar sua honra, punir os traidores e proteger aqueles que ama.",
        "coverUrl": "https://img.youtube.com/vi/vBN_WIp5tGs/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/vBN_WIp5tGs/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,vinganca,poder,romance,drama",
        "totalEpisodes": 27,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 2420000,
        "likesCount": 9861,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vBN_WIp5tGs",
                "durationSeconds": 1723,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/X_E_YnqIHpk",
                "durationSeconds": 1356,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7lGa1ZBtqaE",
                "durationSeconds": 1723,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/i9b8UxXLwDc",
                "durationSeconds": 1356,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/A5I4l6InJrk",
                "durationSeconds": 489,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cx5A92p8V2M",
                "durationSeconds": 1525,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/oNO3epWWm4Y",
                "durationSeconds": 891,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vFiAwxFyhLA",
                "durationSeconds": 1690,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NDAHdE2e8us",
                "durationSeconds": 1356,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7y110eTpMm0",
                "durationSeconds": 1356,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Tqb-3kb3tU4",
                "durationSeconds": 1356,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XnlCfMZM5Yg",
                "durationSeconds": 1541,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lVD46o_vykI",
                "durationSeconds": 485,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_z72kxxi2Eo",
                "durationSeconds": 1849,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/pkKefsO8p1o",
                "durationSeconds": 1721,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FPwMRqtJzvE",
                "durationSeconds": 1522,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/J0Yf2odZKjc",
                "durationSeconds": 1356,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/alvYg7iLjmI",
                "durationSeconds": 1356,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hOrj0x572go",
                "durationSeconds": 1690,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wXSZr5D11eE",
                "durationSeconds": 1356,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1nVx59dtl0U",
                "durationSeconds": 1723,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mvMVo4CgvNg",
                "durationSeconds": 1356,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Parte 23",
                "description": "Episódio 23 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/B3vQ0AvU5pQ",
                "durationSeconds": 1723,
                "isFree": false
            },
            {
                "number": 24,
                "title": "Parte 24",
                "description": "Episódio 24 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qJ-LtzxZPgg",
                "durationSeconds": 1696,
                "isFree": false
            },
            {
                "number": 25,
                "title": "Parte 25",
                "description": "Episódio 25 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FyhfyDqzZck",
                "durationSeconds": 891,
                "isFree": false
            },
            {
                "number": 26,
                "title": "Parte 26",
                "description": "Episódio 26 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/oQLK75QYzcE",
                "durationSeconds": 1536,
                "isFree": false
            },
            {
                "number": 27,
                "title": "Parte 27",
                "description": "Episódio 27 de O Retorno do Sábio Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/yTJGO9Se7QE",
                "durationSeconds": 1445,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-um-amor-marcado-pelo-destino",
        "title": "Um Amor Marcado pelo Destino",
        "slug": "um-amor-marcado-pelo-destino",
        "synopsis": "Quando dois caminhos traçados pelas estrelas se cruzam, nenhuma força no mundo é capaz de impedir que a verdade e a paixão venham à tona.",
        "coverUrl": "https://img.youtube.com/vi/H7Dg4FP-Qog/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/H7Dg4FP-Qog/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,romance,drama",
        "totalEpisodes": 17,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 1750000,
        "likesCount": 11701,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/H7Dg4FP-Qog",
                "durationSeconds": 1035,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hgnoGxS1cng",
                "durationSeconds": 1633,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wcXyLk1Zyac",
                "durationSeconds": 1017,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kIhV1nFgaT0",
                "durationSeconds": 1368,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ohDu7zs3LtU",
                "durationSeconds": 1317,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2Vk0qvXnCFA",
                "durationSeconds": 380,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NzlRzvsPoFo",
                "durationSeconds": 389,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/O24vytxhroo",
                "durationSeconds": 1174,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_8Zv3Lvm-Yk",
                "durationSeconds": 1334,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PWLdDYQ2AxI",
                "durationSeconds": 705,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BANwX8gpS_U",
                "durationSeconds": 1198,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GdG-nIpzGss",
                "durationSeconds": 1298,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/q1rqauePqE0",
                "durationSeconds": 1155,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YV0V4UOpLYY",
                "durationSeconds": 380,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/d1SsYUG5CNI",
                "durationSeconds": 1061,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LkEWp7WDWVM",
                "durationSeconds": 1235,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Um Amor Marcado pelo Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VlOn-ZztAbg",
                "durationSeconds": 1051,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-casada-com-o-rei-dragao",
        "title": "Casada com o Rei Dragão",
        "slug": "casada-com-o-rei-dragao",
        "synopsis": "Um matrimônio selado por dever ancestral coloca uma jovem mortal face a face com o soberano dos dragões, onde o perigo e a paixão colidem.",
        "coverUrl": "https://img.youtube.com/vi/K83ELHdnPBY/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/K83ELHdnPBY/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,fantasia,sobrenatural,casamento-arranjado,romance,drama",
        "totalEpisodes": 17,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 1980000,
        "likesCount": 5517,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/K83ELHdnPBY",
                "durationSeconds": 1890,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-UNO5LeEG-g",
                "durationSeconds": 537,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZWp3ZyWL0_4",
                "durationSeconds": 2112,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/k9rHQNtXrXY",
                "durationSeconds": 1860,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5WMW92KdLOA",
                "durationSeconds": 1882,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QWLnkw74WMA",
                "durationSeconds": 2010,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vO-OLmPN9uc",
                "durationSeconds": 1976,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xlGCuVKcg2M",
                "durationSeconds": 214,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/86mqusfr13k",
                "durationSeconds": 1890,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dbt0YgGBV0I",
                "durationSeconds": 2119,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MV_GIGgz1Q4",
                "durationSeconds": 1762,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_p8i3eTSY_s",
                "durationSeconds": 2112,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FBlC1WopGZ8",
                "durationSeconds": 1860,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_YsdTvQXCHE",
                "durationSeconds": 1882,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3xX2dqCsTVY",
                "durationSeconds": 1734,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xNohaJRZZXs",
                "durationSeconds": 1861,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Casada com o Rei Dragão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/iwLyB2Shscc",
                "durationSeconds": 1860,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-natal-com-meu-rei-da-mafia",
        "title": "Natal com Meu Rei da Máfia",
        "slug": "natal-com-meu-rei-da-mafia",
        "synopsis": "Um encontro proibido durante as festas de fim de ano transforma a vida de uma mulher comum ao lado do chefe mais temido da máfia.",
        "coverUrl": "https://img.youtube.com/vi/y1zrsIpShKk/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/y1zrsIpShKk/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,mafia,suspense,romance,drama",
        "totalEpisodes": 15,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 1520000,
        "likesCount": 8953,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/y1zrsIpShKk",
                "durationSeconds": 1307,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UVgfXf9WVgM",
                "durationSeconds": 404,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XLXbqskrEDs",
                "durationSeconds": 1253,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_NHhGOzi3Pc",
                "durationSeconds": 1223,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/x4hUUo7-R4c",
                "durationSeconds": 1286,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/v4aM5xwsXeU",
                "durationSeconds": 318,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6y8pJDRewtA",
                "durationSeconds": 1237,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/N5YCjqKlwVs",
                "durationSeconds": 540,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fI9GASdCEv4",
                "durationSeconds": 1269,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RMyN1hDH11g",
                "durationSeconds": 1232,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Sr6YjAyqWxo",
                "durationSeconds": 1357,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vaS83rREGxM",
                "durationSeconds": 1048,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_5c8eGBV-R4",
                "durationSeconds": 1280,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bjP830dUAjM",
                "durationSeconds": 1280,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Natal com Meu Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CaW0A16tKLM",
                "durationSeconds": 1080,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-um-bilionario-uma-noiva-falsa-um-bebe-inesperado-e-um-amor-que-nenhum-dos-d",
        "title": "Um bilionário, uma noiva falsa, um bebê inesperado — e um amor que nenhum dos dois viu chegar.",
        "slug": "um-bilionario-uma-noiva-falsa-um-bebe-inesperado-e-um-amor-que-nenhum-dos-d",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em Um bilionário, uma noiva falsa, um bebê inesperado — e um amor que nenhum dos dois viu chegar..",
        "coverUrl": "https://img.youtube.com/vi/CCX-X2TOW6w/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/CCX-X2TOW6w/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bombando,tendencias,bilionario,ceo,luxo,casamento-arranjado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 34223,
        "likesCount": 11978,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Um bilionário, uma noiva falsa, um bebê inesperado — e um amor que nenhum dos dois viu chegar. completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CCX-X2TOW6w",
                "durationSeconds": 4320,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-quando-nos-reencontrarmos",
        "title": "Quando Nos Reencontrarmos",
        "slug": "quando-nos-reencontrarmos",
        "synopsis": "Anos após uma dolorosa separação, o reencontro traz à tona promessas esquecidas e uma chama que o tempo jamais conseguiu apagar.",
        "coverUrl": "https://img.youtube.com/vi/Onu1a_X0JYU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Onu1a_X0JYU/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,romance,drama",
        "totalEpisodes": 17,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 820000,
        "likesCount": 6725,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Onu1a_X0JYU",
                "durationSeconds": 688,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0A9Zrus46zM",
                "durationSeconds": 549,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dSdKVObAngk",
                "durationSeconds": 864,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/i3L_JIeFl0Y",
                "durationSeconds": 235,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/m9zDSQc9G0U",
                "durationSeconds": 640,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SS3he19MBkQ",
                "durationSeconds": 265,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Xz55hf1uCAQ",
                "durationSeconds": 1373,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3Ell7hI9Lr4",
                "durationSeconds": 682,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8jmNs4FPPFY",
                "durationSeconds": 884,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AxC4Xzz5eTw",
                "durationSeconds": 690,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gjzQeUIPIAM",
                "durationSeconds": 420,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0r5idqrYLbU",
                "durationSeconds": 711,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/obcaBW0Ga4s",
                "durationSeconds": 266,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ooqrMZoczHU",
                "durationSeconds": 640,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/O69b8a8zNK8",
                "durationSeconds": 332,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3bzW8mQhSIQ",
                "durationSeconds": 549,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Quando Nos Reencontrarmos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YlMpN7eVlik",
                "durationSeconds": 689,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-bebado-sem-lobo-rorin",
        "title": "O Bêbado Sem Lobo (Rorin)",
        "slug": "o-bebado-sem-lobo-rorin",
        "synopsis": "Rejeitado pela alcatéia e desacreditado por todos, Rorin descobre uma força oculta que desafiará a própria hierarquia dos lobos.",
        "coverUrl": "https://img.youtube.com/vi/1Y7TfQtPDMk/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/1Y7TfQtPDMk/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bombando,tendencias,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 31,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 980000,
        "likesCount": 7925,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1Y7TfQtPDMk",
                "durationSeconds": 591,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XJ666WDzZwc",
                "durationSeconds": 2170,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eTfntEVORbM",
                "durationSeconds": 2176,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Oq1Y2ZuJ3SE",
                "durationSeconds": 2010,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xAjcKBFSrwE",
                "durationSeconds": 272,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CeejbH3-zdU",
                "durationSeconds": 929,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jLR93xBiAMI",
                "durationSeconds": 2163,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/yP_ZsVkvk0Y",
                "durationSeconds": 269,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZkUsxlV6SVk",
                "durationSeconds": 272,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/a5f-8NQVNcw",
                "durationSeconds": 938,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SjHhG8e-kXY",
                "durationSeconds": 271,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/sphd0UnRu_c",
                "durationSeconds": 1240,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/S_tnPUTp0p4",
                "durationSeconds": 2170,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/78QktSrK5IU",
                "durationSeconds": 2228,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2pe4DQmUzsU",
                "durationSeconds": 250,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Pvo4-3aImzE",
                "durationSeconds": 2170,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Np4pHNU8QNw",
                "durationSeconds": 2189,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/keMRS0ZijcQ",
                "durationSeconds": 1672,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nbGPSRkt_oA",
                "durationSeconds": 181,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CSY1iMPdaTE",
                "durationSeconds": 590,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BcvBLzRUznk",
                "durationSeconds": 1262,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cPPODD1l8GA",
                "durationSeconds": 938,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Parte 23",
                "description": "Episódio 23 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Vb15cZ-hw34",
                "durationSeconds": 1122,
                "isFree": false
            },
            {
                "number": 24,
                "title": "Parte 24",
                "description": "Episódio 24 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/St3RDIqXbCM",
                "durationSeconds": 2363,
                "isFree": false
            },
            {
                "number": 25,
                "title": "Parte 25",
                "description": "Episódio 25 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5TSBSHhtZYM",
                "durationSeconds": 2170,
                "isFree": false
            },
            {
                "number": 26,
                "title": "Parte 26",
                "description": "Episódio 26 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/P3T1hL8XbMM",
                "durationSeconds": 1809,
                "isFree": false
            },
            {
                "number": 27,
                "title": "Parte 27",
                "description": "Episódio 27 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1A7x3bOzOW8",
                "durationSeconds": 611,
                "isFree": false
            },
            {
                "number": 28,
                "title": "Parte 28",
                "description": "Episódio 28 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/icybl3fVKqs",
                "durationSeconds": 2010,
                "isFree": false
            },
            {
                "number": 29,
                "title": "Parte 29",
                "description": "Episódio 29 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1HpbzEP4Mtw",
                "durationSeconds": 938,
                "isFree": false
            },
            {
                "number": 30,
                "title": "Parte 30",
                "description": "Episódio 30 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/V2J-37Zfp2U",
                "durationSeconds": 2170,
                "isFree": false
            },
            {
                "number": 31,
                "title": "Parte 31",
                "description": "Episódio 31 de O Bêbado Sem Lobo (Rorin) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Qbp2bsCW1oY",
                "durationSeconds": 250,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-filho-do-alfa-segredo-do-amor",
        "title": "Filho do Alfa Segredo do Amor",
        "slug": "filho-do-alfa-segredo-do-amor",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em Filho do Alfa Segredo do Amor.",
        "coverUrl": "https://img.youtube.com/vi/IeYubpSC1kI/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/IeYubpSC1kI/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 14,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 890000,
        "likesCount": 12074,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IeYubpSC1kI",
                "durationSeconds": 830,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jONZK6Pql3g",
                "durationSeconds": 830,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/b3AS5r0DQHE",
                "durationSeconds": 851,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_LNJDsA8lwQ",
                "durationSeconds": 258,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9TBN39rQHsc",
                "durationSeconds": 829,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/iIe72mfHHvU",
                "durationSeconds": 1043,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/U65FuC3zMU8",
                "durationSeconds": 902,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/V6K2_tqyzag",
                "durationSeconds": 902,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RhhJTwkqroA",
                "durationSeconds": 1164,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fY9erdM0Tag",
                "durationSeconds": 785,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bOU1V5uKac8",
                "durationSeconds": 831,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YdSVybDYUcM",
                "durationSeconds": 923,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/KcHktAWFIR8",
                "durationSeconds": 1000,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Filho do Alfa Segredo do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rpC0v0qar3k",
                "durationSeconds": 1153,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-olho-divino-poder-sem-limites",
        "title": "Olho Divino, Poder Sem Limites",
        "slug": "olho-divino-poder-sem-limites",
        "synopsis": "Acompanhe a emocionante história de Olho Divino, Poder Sem Limites, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/QO_GZJnyG4c/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/QO_GZJnyG4c/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,romance,drama",
        "totalEpisodes": 7,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 22450,
        "likesCount": 7857,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Olho Divino, Poder Sem Limites completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QO_GZJnyG4c",
                "durationSeconds": 868,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Olho Divino, Poder Sem Limites completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/azBf5joCVOE",
                "durationSeconds": 1161,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Olho Divino, Poder Sem Limites completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Nni6V8uwVqs",
                "durationSeconds": 673,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Olho Divino, Poder Sem Limites completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8FAVF7c9gW0",
                "durationSeconds": 868,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Olho Divino, Poder Sem Limites completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/KWEB9RiTjsg",
                "durationSeconds": 275,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Olho Divino, Poder Sem Limites completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/54YisW6i-jA",
                "durationSeconds": 548,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Olho Divino, Poder Sem Limites completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2eI6khViKDA",
                "durationSeconds": 658,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-nosso-lar-nosso-amor",
        "title": "Nosso Lar, Nosso Amor",
        "slug": "nosso-lar-nosso-amor",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Nosso Lar, Nosso Amor.",
        "coverUrl": "https://img.youtube.com/vi/QppzC2NKZz8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/QppzC2NKZz8/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,romance,drama",
        "totalEpisodes": 16,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 760000,
        "likesCount": 6798,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QppzC2NKZz8",
                "durationSeconds": 1027,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/M0bWUi_Bp1o",
                "durationSeconds": 940,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WBe1SvrGuc8",
                "durationSeconds": 386,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7Nc857-gAnw",
                "durationSeconds": 1240,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qzf6ywLvd2k",
                "durationSeconds": 1215,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WqlZ0HEcVdU",
                "durationSeconds": 431,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4F95jmWGSHE",
                "durationSeconds": 1223,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xmfYAEPXoWU",
                "durationSeconds": 1111,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/h4EaU67gjkY",
                "durationSeconds": 1240,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/oAcp8_KM81A",
                "durationSeconds": 406,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/H8reuAZp5OA",
                "durationSeconds": 385,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6lZm-8NrH7M",
                "durationSeconds": 230,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nzAJN6zdNyI",
                "durationSeconds": 928,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6iywi0y2wqw",
                "durationSeconds": 1474,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OtAQ2YJkfnI",
                "durationSeconds": 1214,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Nosso Lar, Nosso Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZZJYTdvSY7s",
                "durationSeconds": 1253,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-meu-rival-no-gelo",
        "title": "Meu Rival no Gelo",
        "slug": "meu-rival-no-gelo",
        "synopsis": "Acompanhe a emocionante história de Meu Rival no Gelo, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/YVBaEG0jrn8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/YVBaEG0jrn8/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bombando,tendencias,romance,drama",
        "totalEpisodes": 7,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 34255,
        "likesCount": 11989,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Meu Rival no Gelo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YVBaEG0jrn8",
                "durationSeconds": 248,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Meu Rival no Gelo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/pmcMbVFw1vY",
                "durationSeconds": 249,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Meu Rival no Gelo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-gDXC8ig0rM",
                "durationSeconds": 803,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Meu Rival no Gelo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/d9UvW-xIcDE",
                "durationSeconds": 303,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Meu Rival no Gelo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8zu87ktlfg4",
                "durationSeconds": 476,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Meu Rival no Gelo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/sGitYQbawqw",
                "durationSeconds": 590,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Meu Rival no Gelo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BnjMx4LblUM",
                "durationSeconds": 249,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-amor-em-jogo-com-o-bilionario",
        "title": "Amor em Jogo com o Bilionário",
        "slug": "amor-em-jogo-com-o-bilionario",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em Amor em Jogo com o Bilionário.",
        "coverUrl": "https://img.youtube.com/vi/VjMR6eVQP6U/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/VjMR6eVQP6U/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bombando,tendencias,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 18,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 1150000,
        "likesCount": 8892,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VjMR6eVQP6U",
                "durationSeconds": 738,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tOdHCUgZWWE",
                "durationSeconds": 701,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/B1DeLIlFHsk",
                "durationSeconds": 722,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0EnnBwozbXw",
                "durationSeconds": 649,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/miF6XB1y0oo",
                "durationSeconds": 858,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/awjnV7bvV-8",
                "durationSeconds": 769,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/M2JKNNUXSdc",
                "durationSeconds": 609,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wC6iyFZta_M",
                "durationSeconds": 834,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Wh4-SQPjr8Y",
                "durationSeconds": 858,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2fUtjsyKlA4",
                "durationSeconds": 846,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SYrN059Gi8k",
                "durationSeconds": 839,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Kth2uAPRx_I",
                "durationSeconds": 365,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6qP7bXpjJKU",
                "durationSeconds": 858,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/T9Bicrs0DGM",
                "durationSeconds": 808,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/J-xT0vsCd5M",
                "durationSeconds": 841,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6utYt0Bhfds",
                "durationSeconds": 867,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0t_3N4zXAXc",
                "durationSeconds": 729,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Amor em Jogo com o Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dZKp_K_HnuI",
                "durationSeconds": 872,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-noiva-virgem-do-alfa",
        "title": "Noiva Virgem do Alfa",
        "slug": "noiva-virgem-do-alfa",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em Noiva Virgem do Alfa.",
        "coverUrl": "https://img.youtube.com/vi/x8cmk6_aPHc/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/x8cmk6_aPHc/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bombando,tendencias,fantasia,sobrenatural,casamento-arranjado,romance,drama",
        "totalEpisodes": 23,
        "freeEpisodesCount": 1,
        "isFeatured": true,
        "isVertical": true,
        "viewsCount": 1240000,
        "likesCount": 5594,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/x8cmk6_aPHc",
                "durationSeconds": 728,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GVelleFMRqU",
                "durationSeconds": 665,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/u6b3XVXcfNc",
                "durationSeconds": 728,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FtkAYFMqQ5w",
                "durationSeconds": 528,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Wj9xQV3ot0k",
                "durationSeconds": 528,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/f8yLEuFWCkg",
                "durationSeconds": 410,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ip0v0YYxZS0",
                "durationSeconds": 293,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YBVqcGetCgw",
                "durationSeconds": 927,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Knb50Jq4FPE",
                "durationSeconds": 639,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lxaPCBzR6sw",
                "durationSeconds": 392,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CV2RcLVjZ_8",
                "durationSeconds": 843,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tPv-ILWTYrY",
                "durationSeconds": 867,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rEMbEemoNaE",
                "durationSeconds": 300,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JgIPUogUDzc",
                "durationSeconds": 755,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ywx0HJBDNI4",
                "durationSeconds": 300,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QItEnSvBArQ",
                "durationSeconds": 182,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jbzVoHL4URA",
                "durationSeconds": 989,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Bqnl6iB9f8M",
                "durationSeconds": 916,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0mF7uVGHTQY",
                "durationSeconds": 736,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/TUnO59nyOAk",
                "durationSeconds": 672,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QFUdnN25Uro",
                "durationSeconds": 825,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GY1mfnaGcJw",
                "durationSeconds": 1016,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Parte 23",
                "description": "Episódio 23 de Noiva Virgem do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/prMsYT0Aswg",
                "durationSeconds": 896,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-natal-despertar-eu-vejo-tudo",
        "title": "Natal Despertar: Eu Vejo Tudo",
        "slug": "natal-despertar-eu-vejo-tudo",
        "synopsis": "Acompanhe a emocionante história de Natal Despertar: Eu Vejo Tudo, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/RYGjpyCN3S8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/RYGjpyCN3S8/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,romance,drama",
        "totalEpisodes": 19,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33496,
        "likesCount": 11723,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RYGjpyCN3S8",
                "durationSeconds": 1692,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jnQJGFoBmjY",
                "durationSeconds": 1167,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vPWSOd5z0TU",
                "durationSeconds": 1204,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/T8r-N53W8rY",
                "durationSeconds": 1783,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3TmHQ6P2ACo",
                "durationSeconds": 1109,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8uEovNT_cEA",
                "durationSeconds": 1165,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NssDDGNG0ZY",
                "durationSeconds": 1175,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AMRlDlZs5NA",
                "durationSeconds": 1692,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ktlqVR8DFTg",
                "durationSeconds": 214,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nOHc3oxF93Y",
                "durationSeconds": 910,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0-ZJg8Cqqjc",
                "durationSeconds": 1422,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ukzs9_xN448",
                "durationSeconds": 1119,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XMfA9rBTeqU",
                "durationSeconds": 200,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_l-iQW65UKE",
                "durationSeconds": 471,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XoDukTGP-rc",
                "durationSeconds": 1134,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-PYduh2EW7c",
                "durationSeconds": 520,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QmaCWa8y7K8",
                "durationSeconds": 1205,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1IGZ8YDv_ao",
                "durationSeconds": 1110,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de Natal Despertar: Eu Vejo Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SDphWeUr6Yw",
                "durationSeconds": 1175,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-fortuna-e-poder-em-minutos",
        "title": "Fortuna e Poder em Minutos",
        "slug": "fortuna-e-poder-em-minutos",
        "synopsis": "Acompanhe a emocionante história de Fortuna e Poder em Minutos, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/Txf9isUWRmA/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Txf9isUWRmA/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,romance,drama",
        "totalEpisodes": 8,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 28025,
        "likesCount": 9808,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Fortuna e Poder em Minutos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Txf9isUWRmA",
                "durationSeconds": 1725,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Fortuna e Poder em Minutos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/roTyx4Ywxnk",
                "durationSeconds": 800,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Fortuna e Poder em Minutos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EyyIsxaHde0",
                "durationSeconds": 1398,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Fortuna e Poder em Minutos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/I4S-BwvuJFk",
                "durationSeconds": 1725,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Fortuna e Poder em Minutos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Dk2fU4ji11g",
                "durationSeconds": 1013,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Fortuna e Poder em Minutos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rW22VAZ3kXM",
                "durationSeconds": 1733,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Fortuna e Poder em Minutos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ufYf9m3N8R4",
                "durationSeconds": 354,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Fortuna e Poder em Minutos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0zF3TAqZ7OI",
                "durationSeconds": 354,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-brilho-por-tras-do-disfarce",
        "title": "O Brilho por Trás do Disfarce",
        "slug": "o-brilho-por-tras-do-disfarce",
        "synopsis": "Acompanhe a emocionante história de O Brilho por Trás do Disfarce, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/38tzSOnmaHk/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/38tzSOnmaHk/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bombando,tendencias,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 12396,
        "likesCount": 4338,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Brilho por Trás do Disfarce completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/38tzSOnmaHk",
                "durationSeconds": 1042,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Brilho por Trás do Disfarce completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QX6NjP4-orY",
                "durationSeconds": 277,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Brilho por Trás do Disfarce completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/deJTTGGYViE",
                "durationSeconds": 2021,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Brilho por Trás do Disfarce completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SNnzi74cvEY",
                "durationSeconds": 695,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Brilho por Trás do Disfarce completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PJFkq8I5PJc",
                "durationSeconds": 1973,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-no-leito-da-vinganca",
        "title": "No Leito da Vingança",
        "slug": "no-leito-da-vinganca",
        "synopsis": "Humilhado no passado, o retorno triunfal para cobrar cada dívida e proteger quem ama abala as estruturas de todos os traidores em No Leito da Vingança.",
        "coverUrl": "https://img.youtube.com/vi/kVnEpJNxFcY/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/kVnEpJNxFcY/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bombando,tendencias,vinganca,poder,romance,drama",
        "totalEpisodes": 31,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32236,
        "likesCount": 11282,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kVnEpJNxFcY",
                "durationSeconds": 1198,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ymu-LerrcO0",
                "durationSeconds": 1523,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bGGqgF2d31M",
                "durationSeconds": 569,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RInTA07AhKg",
                "durationSeconds": 1506,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FCq3QbV2Su0",
                "durationSeconds": 433,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IbV1oFEaoZY",
                "durationSeconds": 1575,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RsoIb83wsrI",
                "durationSeconds": 508,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xBtbbr5yBD4",
                "durationSeconds": 1358,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/onf2t39nMZI",
                "durationSeconds": 221,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PvX91PNyNKs",
                "durationSeconds": 521,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ic_EPA0glwc",
                "durationSeconds": 1553,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/svhN6DqqzqI",
                "durationSeconds": 3010,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PY8W8fplckw",
                "durationSeconds": 1284,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/r5fbNVeWAy0",
                "durationSeconds": 1512,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vZRih4V1nbE",
                "durationSeconds": 741,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/31-tYU5sgHU",
                "durationSeconds": 1534,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JJCroHcnhMU",
                "durationSeconds": 1523,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tQSkI7ewqRE",
                "durationSeconds": 1327,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/V9kXXcV1bzs",
                "durationSeconds": 1527,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/h9YZPaZMT6c",
                "durationSeconds": 1525,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/U8v323GGr8g",
                "durationSeconds": 1453,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/D-Ss0MK-hx4",
                "durationSeconds": 1470,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Parte 23",
                "description": "Episódio 23 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7jRPjATlE9c",
                "durationSeconds": 685,
                "isFree": false
            },
            {
                "number": 24,
                "title": "Parte 24",
                "description": "Episódio 24 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/syuyPko3EyY",
                "durationSeconds": 1472,
                "isFree": false
            },
            {
                "number": 25,
                "title": "Parte 25",
                "description": "Episódio 25 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6M4Y4wcKJR0",
                "durationSeconds": 535,
                "isFree": false
            },
            {
                "number": 26,
                "title": "Parte 26",
                "description": "Episódio 26 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9prghb_8Yyg",
                "durationSeconds": 1249,
                "isFree": false
            },
            {
                "number": 27,
                "title": "Parte 27",
                "description": "Episódio 27 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/K9JL699bin4",
                "durationSeconds": 418,
                "isFree": false
            },
            {
                "number": 28,
                "title": "Parte 28",
                "description": "Episódio 28 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zyzneZNGUjw",
                "durationSeconds": 1327,
                "isFree": false
            },
            {
                "number": 29,
                "title": "Parte 29",
                "description": "Episódio 29 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/L_eeXVHhvzw",
                "durationSeconds": 1546,
                "isFree": false
            },
            {
                "number": 30,
                "title": "Parte 30",
                "description": "Episódio 30 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ouTYEh-G2LM",
                "durationSeconds": 1522,
                "isFree": false
            },
            {
                "number": 31,
                "title": "Parte 31",
                "description": "Episódio 31 de No Leito da Vingança completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/exdNcIcv8ug",
                "durationSeconds": 1506,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-beijo-que-expoe-tudo",
        "title": "Beijo que Expõe Tudo",
        "slug": "beijo-que-expoe-tudo",
        "synopsis": "Acompanhe a emocionante história de Beijo que Expõe Tudo, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/1sDlRQYfH5U/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/1sDlRQYfH5U/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 19,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 30253,
        "likesCount": 10588,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1sDlRQYfH5U",
                "durationSeconds": 1465,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zNT5BU4MJdA",
                "durationSeconds": 283,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FZOehmcdBgQ",
                "durationSeconds": 964,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/pQTa0nnud_g",
                "durationSeconds": 1122,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RHPgQvuLogo",
                "durationSeconds": 717,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8BYFu-JBhD8",
                "durationSeconds": 645,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/p3SciU30P_Q",
                "durationSeconds": 539,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qIbUSu7tC78",
                "durationSeconds": 817,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vzSnSX_1CtM",
                "durationSeconds": 819,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eqZ8mJvMd4Y",
                "durationSeconds": 861,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IgFWvgHpJ4w",
                "durationSeconds": 1529,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DWsQp655tzI",
                "durationSeconds": 733,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Zx_Y5GLrHNY",
                "durationSeconds": 263,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QkYIIWYP0vw",
                "durationSeconds": 1513,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/aXFcJnSNPO0",
                "durationSeconds": 804,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OTi-8dc21Sw",
                "durationSeconds": 889,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HWoSmxXQjhs",
                "durationSeconds": 1751,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FCBv0tckdRw",
                "durationSeconds": 789,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de Beijo que Expõe Tudo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Sk-1h9TKCwI",
                "durationSeconds": 795,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-esposa-inesperada-a-bela-adormecida",
        "title": "Esposa Inesperada: A Bela Adormecida",
        "slug": "esposa-inesperada-a-bela-adormecida",
        "synopsis": "Um matrimônio selado por conveniência e obrigações familiares esconde sentimentos intensos e segredos proibidos em Esposa Inesperada: A Bela Adormecida.",
        "coverUrl": "https://img.youtube.com/vi/IKATcW4Cw4Q/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/IKATcW4Cw4Q/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 19,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 8730,
        "likesCount": 3055,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IKATcW4Cw4Q",
                "durationSeconds": 216,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ny7Fys1Lugk",
                "durationSeconds": 1288,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rsuSGIhZKWg",
                "durationSeconds": 545,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qqU-bIriZiA",
                "durationSeconds": 542,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qLktUgBK4PE",
                "durationSeconds": 1525,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AhqO2Ja01W0",
                "durationSeconds": 1541,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ssfrr9W6AQY",
                "durationSeconds": 1516,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eUfjF6WmnPk",
                "durationSeconds": 1442,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/65l1TNop9Eg",
                "durationSeconds": 295,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/immoVVei87s",
                "durationSeconds": 1395,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GN41daxVAD0",
                "durationSeconds": 850,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SUQvkwQLD4Q",
                "durationSeconds": 1504,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QBxjk3rPL9Y",
                "durationSeconds": 1163,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dk8FyzbH0k0",
                "durationSeconds": 837,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/72DwiDI-6wI",
                "durationSeconds": 875,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/V_DykV__MY0",
                "durationSeconds": 476,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Iysc0DRrUVU",
                "durationSeconds": 1817,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SoV1OANcJoc",
                "durationSeconds": 1328,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de Esposa Inesperada: A Bela Adormecida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vOlghRafUHk",
                "durationSeconds": 1530,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-esposa-xxl-do-prefeito-seu-retorno-incrivel",
        "title": "A Esposa XXL do Prefeito:Seu Retorno Incrível",
        "slug": "a-esposa-xxl-do-prefeito-seu-retorno-incrivel",
        "synopsis": "Humilhado no passado, o retorno triunfal para cobrar cada dívida e proteger quem ama abala as estruturas de todos os traidores em A Esposa XXL do Prefeito:Seu Retorno Incrível.",
        "coverUrl": "https://img.youtube.com/vi/3HQlDwfYNK0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/3HQlDwfYNK0/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,vinganca,poder,romance,drama",
        "totalEpisodes": 30,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 30501,
        "likesCount": 10675,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3HQlDwfYNK0",
                "durationSeconds": 945,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/sRkdE2O3fco",
                "durationSeconds": 473,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Pj_aDjOlWso",
                "durationSeconds": 651,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/g5QQ7KYBRd8",
                "durationSeconds": 953,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wKYPDQxGE40",
                "durationSeconds": 814,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/TVSQcyNOEq8",
                "durationSeconds": 574,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/V_SZYGrvx-4",
                "durationSeconds": 774,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9796Caim6IY",
                "durationSeconds": 519,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dYUceVpknoA",
                "durationSeconds": 256,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WVb9GGCcsXI",
                "durationSeconds": 896,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DKqkcH1UhvI",
                "durationSeconds": 518,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nqoCP-VhteQ",
                "durationSeconds": 182,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dXvqK2lgIAI",
                "durationSeconds": 243,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/so48ajEN8qk",
                "durationSeconds": 1104,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VMVLawUXlrw",
                "durationSeconds": 595,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OnFT26tZ3y4",
                "durationSeconds": 798,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/x9vgtRKE8dU",
                "durationSeconds": 1071,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9TqTCZZ8NLc",
                "durationSeconds": 610,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/x4BtAAVJ1pI",
                "durationSeconds": 796,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/018HamAeFHc",
                "durationSeconds": 1068,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SzvrxcgA_OI",
                "durationSeconds": 214,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PcafY7AZL_s",
                "durationSeconds": 1027,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Parte 23",
                "description": "Episódio 23 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FKsfMCLVSOg",
                "durationSeconds": 1241,
                "isFree": false
            },
            {
                "number": 24,
                "title": "Parte 24",
                "description": "Episódio 24 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qSngK2J46Zs",
                "durationSeconds": 1013,
                "isFree": false
            },
            {
                "number": 25,
                "title": "Parte 25",
                "description": "Episódio 25 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QYHnxA-0yXs",
                "durationSeconds": 765,
                "isFree": false
            },
            {
                "number": 26,
                "title": "Parte 26",
                "description": "Episódio 26 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lWv0UtA3Z-4",
                "durationSeconds": 790,
                "isFree": false
            },
            {
                "number": 27,
                "title": "Parte 27",
                "description": "Episódio 27 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/heDYJvPBNuc",
                "durationSeconds": 782,
                "isFree": false
            },
            {
                "number": 28,
                "title": "Parte 28",
                "description": "Episódio 28 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ith0C8Vg5_Q",
                "durationSeconds": 463,
                "isFree": false
            },
            {
                "number": 29,
                "title": "Parte 29",
                "description": "Episódio 29 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VgwknjmCOpA",
                "durationSeconds": 324,
                "isFree": false
            },
            {
                "number": 30,
                "title": "Parte 30",
                "description": "Episódio 30 de A Esposa XXL do Prefeito:Seu Retorno Incrível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wC5YWIPfaBw",
                "durationSeconds": 432,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-voo-para-o-amor-i",
        "title": "Voo para o Amor I",
        "slug": "voo-para-o-amor-i",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Voo para o Amor I.",
        "coverUrl": "https://img.youtube.com/vi/-vgVIWDhqfM/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/-vgVIWDhqfM/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 31,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32045,
        "likesCount": 11215,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-vgVIWDhqfM",
                "durationSeconds": 901,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/o5BkRdOht_0",
                "durationSeconds": 901,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vT6wW0SRoqk",
                "durationSeconds": 1044,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/U-bFeS0mf3o",
                "durationSeconds": 510,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9GrMIwrTtW8",
                "durationSeconds": 598,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RNW93YmuNCo",
                "durationSeconds": 834,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/edxhsAbgVmc",
                "durationSeconds": 845,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/O-ynoWDgr6g",
                "durationSeconds": 235,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EBND_wZgy5M",
                "durationSeconds": 566,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GIK1VyL4SKI",
                "durationSeconds": 417,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/p9cylmEffIA",
                "durationSeconds": 298,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2U4lBjwrCcU",
                "durationSeconds": 233,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GInlTRJMx5s",
                "durationSeconds": 660,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/967HQtp0BGo",
                "durationSeconds": 1410,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xKZSnethoH0",
                "durationSeconds": 660,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0COV1UOTfwQ",
                "durationSeconds": 485,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wnk1aK5KcQA",
                "durationSeconds": 947,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/iB7KvSzU28A",
                "durationSeconds": 273,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wiLs8Bv_hHA",
                "durationSeconds": 1069,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/S2oUIP0w5bw",
                "durationSeconds": 586,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qJQsI3S9wVc",
                "durationSeconds": 1066,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CN7dH285HjI",
                "durationSeconds": 926,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Parte 23",
                "description": "Episódio 23 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mHf7wmoSYg0",
                "durationSeconds": 246,
                "isFree": false
            },
            {
                "number": 24,
                "title": "Parte 24",
                "description": "Episódio 24 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bcr9kzObZqw",
                "durationSeconds": 822,
                "isFree": false
            },
            {
                "number": 25,
                "title": "Parte 25",
                "description": "Episódio 25 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dDFlNyFVi7g",
                "durationSeconds": 660,
                "isFree": false
            },
            {
                "number": 26,
                "title": "Parte 26",
                "description": "Episódio 26 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/sgYDgniVuok",
                "durationSeconds": 252,
                "isFree": false
            },
            {
                "number": 27,
                "title": "Parte 27",
                "description": "Episódio 27 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DKUcBrg-qXQ",
                "durationSeconds": 935,
                "isFree": false
            },
            {
                "number": 28,
                "title": "Parte 28",
                "description": "Episódio 28 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1KXLYAbq5pU",
                "durationSeconds": 1053,
                "isFree": false
            },
            {
                "number": 29,
                "title": "Parte 29",
                "description": "Episódio 29 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lHuEJTOyQQQ",
                "durationSeconds": 731,
                "isFree": false
            },
            {
                "number": 30,
                "title": "Parte 30",
                "description": "Episódio 30 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_YfFOPXMPsc",
                "durationSeconds": 935,
                "isFree": false
            },
            {
                "number": 31,
                "title": "Parte 31",
                "description": "Episódio 31 de Voo para o Amor I completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ouK0Wk7Om0M",
                "durationSeconds": 485,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-herdeira-usurpada-pela-melhor-amiga",
        "title": "Herdeira Usurpada pela Melhor Amiga",
        "slug": "herdeira-usurpada-pela-melhor-amiga",
        "synopsis": "Acompanhe a emocionante história de Herdeira Usurpada pela Melhor Amiga, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/-jz3MpRuhE0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/-jz3MpRuhE0/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 18,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 11941,
        "likesCount": 4179,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-jz3MpRuhE0",
                "durationSeconds": 818,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4suWBmkt3H0",
                "durationSeconds": 1210,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UwaumhuT_EI",
                "durationSeconds": 927,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/axznaebPC0E",
                "durationSeconds": 1192,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/O67QKg5e0L0",
                "durationSeconds": 1195,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/doznWmtreyg",
                "durationSeconds": 1348,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BmKejYCIAuY",
                "durationSeconds": 307,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LxgB20ma_C4",
                "durationSeconds": 841,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SI8ln4CalVw",
                "durationSeconds": 1236,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0-CRJ7OXGWo",
                "durationSeconds": 1342,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vzR_-yB-ftw",
                "durationSeconds": 929,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eZQcoyc_3q8",
                "durationSeconds": 839,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9jgTCgiSHkQ",
                "durationSeconds": 638,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lXpAhVOtENk",
                "durationSeconds": 638,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UTX4gRfLNsc",
                "durationSeconds": 1149,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ipyKx8ngvRo",
                "durationSeconds": 1209,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WrQefjGe7BY",
                "durationSeconds": 1342,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Herdeira Usurpada pela Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/snRGw_I25Cc",
                "durationSeconds": 575,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-dormindo-por-30-anosirmaos-arrependidos",
        "title": "Dormindo por 30 AnosIrmãos Arrependidos",
        "slug": "dormindo-por-30-anosirmaos-arrependidos",
        "synopsis": "Acompanhe a emocionante história de Dormindo por 30 AnosIrmãos Arrependidos, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/XXY666Jiutg/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/XXY666Jiutg/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 28326,
        "likesCount": 9914,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Dormindo por 30 AnosIrmãos Arrependidos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XXY666Jiutg",
                "durationSeconds": 900,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Dormindo por 30 AnosIrmãos Arrependidos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bOdocvuoYAI",
                "durationSeconds": 902,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Dormindo por 30 AnosIrmãos Arrependidos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CxElAK0XVG8",
                "durationSeconds": 2187,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Dormindo por 30 AnosIrmãos Arrependidos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vDkZ0yTBJQM",
                "durationSeconds": 2000,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Dormindo por 30 AnosIrmãos Arrependidos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YcqCpP71eo0",
                "durationSeconds": 2000,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-chefe-da-mafia-implora",
        "title": "O Chefe da Máfia Implora",
        "slug": "o-chefe-da-mafia-implora",
        "synopsis": "Em um submundo dominado pelo poder e perigo das famílias mafiosas, segredos do passado e uma atração irresistível colocam vidas em jogo em O Chefe da Máfia Implora.",
        "coverUrl": "https://img.youtube.com/vi/n1btmZupCXU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/n1btmZupCXU/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,mafia,suspense,romance,drama",
        "totalEpisodes": 24,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33365,
        "likesCount": 11677,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/n1btmZupCXU",
                "durationSeconds": 1664,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QGj4BwtNRF0",
                "durationSeconds": 1312,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/W1ODLTlaUJs",
                "durationSeconds": 1307,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Red7v4kc4Ok",
                "durationSeconds": 1308,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IdrO0EWZs60",
                "durationSeconds": 335,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-njIAUTKp1k",
                "durationSeconds": 336,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/asGdFnFvnxM",
                "durationSeconds": 1700,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7xuRyHa7V-A",
                "durationSeconds": 1668,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_C3L3taPMDo",
                "durationSeconds": 1730,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6OVo5aMIwjk",
                "durationSeconds": 1305,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/iGEqKs7jzQo",
                "durationSeconds": 1305,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DUv5vEe3Ra0",
                "durationSeconds": 1590,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VDjc5jEl7xw",
                "durationSeconds": 1530,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xPmdHwEbZf0",
                "durationSeconds": 1682,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/o55LWG2W5hw",
                "durationSeconds": 338,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/auIdwh33KIU",
                "durationSeconds": 300,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rqP2yJ-WrEg",
                "durationSeconds": 1578,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/16ysjTVbeJw",
                "durationSeconds": 1742,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1-dgWXarMNI",
                "durationSeconds": 1218,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VUulSBqJQFo",
                "durationSeconds": 1133,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rH_pGx76vto",
                "durationSeconds": 1773,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/H2jLa7fkhx4",
                "durationSeconds": 1327,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Parte 23",
                "description": "Episódio 23 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MLSr4l2SPL0",
                "durationSeconds": 1216,
                "isFree": false
            },
            {
                "number": 24,
                "title": "Parte 24",
                "description": "Episódio 24 de O Chefe da Máfia Implora completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/TdeGRkwshPc",
                "durationSeconds": 318,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-princesa-esta-de-volta",
        "title": "A Princesa Está de Volta",
        "slug": "a-princesa-esta-de-volta",
        "synopsis": "Acompanhe a emocionante história de A Princesa Está de Volta, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/CNNhZdC9s8E/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/CNNhZdC9s8E/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 19,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 15543,
        "likesCount": 5440,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CNNhZdC9s8E",
                "durationSeconds": 627,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uOpFkmC7bRk",
                "durationSeconds": 858,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7RCZiFOL8jg",
                "durationSeconds": 766,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/h8touMu-xCY",
                "durationSeconds": 599,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/36qlqQ9ZLik",
                "durationSeconds": 627,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8maMnOx4X8k",
                "durationSeconds": 767,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mlFA_SsNbD0",
                "durationSeconds": 771,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2LmoxRPOS6o",
                "durationSeconds": 540,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/obHygzSXlKU",
                "durationSeconds": 318,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/COIoXH8LMu0",
                "durationSeconds": 759,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GAuR0k1jm_g",
                "durationSeconds": 639,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rmAzSG1zWWQ",
                "durationSeconds": 687,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wKgo14FGgTg",
                "durationSeconds": 586,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nF68KNDGPJ0",
                "durationSeconds": 758,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vmsqJ5WjZeA",
                "durationSeconds": 244,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/37esq7otegQ",
                "durationSeconds": 798,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/k2n-_lHYHnI",
                "durationSeconds": 262,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uB6kHOb_BGM",
                "durationSeconds": 205,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de A Princesa Está de Volta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZVn4eLiOtvg",
                "durationSeconds": 870,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-superando-meu-guarda-costas",
        "title": "Superando Meu Guarda-Costas",
        "slug": "superando-meu-guarda-costas",
        "synopsis": "Acompanhe a emocionante história de Superando Meu Guarda-Costas, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/6_Jcsv3jA8s/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/6_Jcsv3jA8s/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 25754,
        "likesCount": 9013,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Superando Meu Guarda-Costas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6_Jcsv3jA8s",
                "durationSeconds": 4176,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-a-ascensao-da-nova-rainha",
        "title": "A Ascensão da Nova Rainha",
        "slug": "a-ascensao-da-nova-rainha",
        "synopsis": "Acompanhe a emocionante história de A Ascensão da Nova Rainha, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/KZgXgKWmT5g/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/KZgXgKWmT5g/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34188,
        "likesCount": 11965,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Ascensão da Nova Rainha completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/KZgXgKWmT5g",
                "durationSeconds": 1560,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Ascensão da Nova Rainha completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PyOgTvJWOkE",
                "durationSeconds": 1512,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Ascensão da Nova Rainha completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VQg3J4nP6Tc",
                "durationSeconds": 208,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Ascensão da Nova Rainha completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CRcPy0ADdJI",
                "durationSeconds": 1539,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Ascensão da Nova Rainha completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NB-v1Tz9P6M",
                "durationSeconds": 1512,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-depois-da-dor-eu-floresci",
        "title": "Depois da Dor, Eu Floresci",
        "slug": "depois-da-dor-eu-floresci",
        "synopsis": "Acompanhe a emocionante história de Depois da Dor, Eu Floresci, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/-7L5HKu6AAI/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/-7L5HKu6AAI/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 19,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 19004,
        "likesCount": 6651,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-7L5HKu6AAI",
                "durationSeconds": 1049,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/M154mNulrUU",
                "durationSeconds": 952,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nrQaDap-AS8",
                "durationSeconds": 1135,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MMHzwwtLhM0",
                "durationSeconds": 774,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LW-uulLX8Jk",
                "durationSeconds": 1060,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0_J1IyufJDA",
                "durationSeconds": 1060,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9w62QfSL0c8",
                "durationSeconds": 993,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ui1ZY_ioaEg",
                "durationSeconds": 1188,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_uw9PybQ5Vo",
                "durationSeconds": 1320,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YyNnTt5lNCc",
                "durationSeconds": 1184,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zZO87iZMRko",
                "durationSeconds": 1082,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GOgtH6knslc",
                "durationSeconds": 701,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bY8G7XKIf3E",
                "durationSeconds": 1030,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zRLAyJDm0f4",
                "durationSeconds": 905,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NHpoCEz5DqM",
                "durationSeconds": 901,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XB4feWxi-sU",
                "durationSeconds": 788,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/V-Nqou9r3UE",
                "durationSeconds": 784,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NZuFAr1pXKI",
                "durationSeconds": 748,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de Depois da Dor, Eu Floresci completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PjuyorgMLbg",
                "durationSeconds": 701,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-quando-a-lua-esconde-sua-coroa",
        "title": "Quando a Lua Esconde Sua Coroa",
        "slug": "quando-a-lua-esconde-sua-coroa",
        "synopsis": "Acompanhe a emocionante história de Quando a Lua Esconde Sua Coroa, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/ot6OdkEImK4/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ot6OdkEImK4/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 22837,
        "likesCount": 7992,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Quando a Lua Esconde Sua Coroa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ot6OdkEImK4",
                "durationSeconds": 525,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Quando a Lua Esconde Sua Coroa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XMi7yHQ2jl4",
                "durationSeconds": 524,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Quando a Lua Esconde Sua Coroa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Dh7vjkqsdbM",
                "durationSeconds": 793,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Quando a Lua Esconde Sua Coroa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vFhmFjyxOoI",
                "durationSeconds": 852,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Quando a Lua Esconde Sua Coroa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/W0kVwsKP3hA",
                "durationSeconds": 866,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Quando a Lua Esconde Sua Coroa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ugBFXletArk",
                "durationSeconds": 934,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Quando a Lua Esconde Sua Coroa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4KDWFpZ6Uik",
                "durationSeconds": 910,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Quando a Lua Esconde Sua Coroa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bR4nj_p57Ik",
                "durationSeconds": 855,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Quando a Lua Esconde Sua Coroa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_ypipPXt94g",
                "durationSeconds": 874,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Quando a Lua Esconde Sua Coroa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jthxP9_tcBo",
                "durationSeconds": 254,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-ela-nunca-buscou-amor",
        "title": "Ela Nunca Buscou Amor",
        "slug": "ela-nunca-buscou-amor",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Ela Nunca Buscou Amor.",
        "coverUrl": "https://img.youtube.com/vi/YzWEiXYPnIU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/YzWEiXYPnIU/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34497,
        "likesCount": 12073,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Ela Nunca Buscou Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YzWEiXYPnIU",
                "durationSeconds": 1580,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Ela Nunca Buscou Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OYRpoj7qN54",
                "durationSeconds": 1586,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Ela Nunca Buscou Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JGgCRLpRquY",
                "durationSeconds": 1239,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Ela Nunca Buscou Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hWPe2b_Fy5o",
                "durationSeconds": 1077,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-largando-o-astro-das-corridas",
        "title": "Largando o Astro das Corridas",
        "slug": "largando-o-astro-das-corridas",
        "synopsis": "Acompanhe a emocionante história de Largando o Astro das Corridas, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/c9s2Xmj-8VI/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/c9s2Xmj-8VI/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 19,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 22256,
        "likesCount": 7789,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/c9s2Xmj-8VI",
                "durationSeconds": 647,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/aumr1AhTO_E",
                "durationSeconds": 816,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/TkldZtifCK0",
                "durationSeconds": 949,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Q6IuVhYP_Kg",
                "durationSeconds": 660,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HbgiOUzlASE",
                "durationSeconds": 809,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kEVTUVjlpnc",
                "durationSeconds": 964,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LEF5lxXHblU",
                "durationSeconds": 696,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/erv1Q5JfxB8",
                "durationSeconds": 1009,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/U8MUmlAqJII",
                "durationSeconds": 568,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qsqEwNwPD3I",
                "durationSeconds": 900,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/N_xVn8Ckbt8",
                "durationSeconds": 916,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/V6quJVd9gnQ",
                "durationSeconds": 445,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Cs7WoQDEmUw",
                "durationSeconds": 1366,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SZxTjvyxlbE",
                "durationSeconds": 566,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NvM-f6421LU",
                "durationSeconds": 1360,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5z1Tsc0mHeo",
                "durationSeconds": 567,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Kpm365OHdTY",
                "durationSeconds": 991,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WfjdBQv6umQ",
                "durationSeconds": 640,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de Largando o Astro das Corridas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FRFQCu7h1jM",
                "durationSeconds": 720,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-noite-do-grande-despertar",
        "title": "A Noite do Grande Despertar",
        "slug": "a-noite-do-grande-despertar",
        "synopsis": "Acompanhe a emocionante história de A Noite do Grande Despertar, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/2Y0ntwzqR5k/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/2Y0ntwzqR5k/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 28,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 19632,
        "likesCount": 6871,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2Y0ntwzqR5k",
                "durationSeconds": 1319,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/iJfQuwsQ3Wg",
                "durationSeconds": 249,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PRV_MT7EzQs",
                "durationSeconds": 1229,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FlUOiS7JK7A",
                "durationSeconds": 249,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eDXeB7AHeKo",
                "durationSeconds": 1569,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/86vHwoNAsps",
                "durationSeconds": 916,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JkXI_VjGh1E",
                "durationSeconds": 249,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/F7HmoQHGBJE",
                "durationSeconds": 1328,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YMTPJdGeLgE",
                "durationSeconds": 1569,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/b1j3tCrtD3A",
                "durationSeconds": 249,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/B78hFRIwmCg",
                "durationSeconds": 1010,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eFnsP0AMFjU",
                "durationSeconds": 1316,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/v5AY71cY_dk",
                "durationSeconds": 698,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8RDhQURjdBI",
                "durationSeconds": 1362,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qWCY0QhdTSI",
                "durationSeconds": 649,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mJkxOC9adJE",
                "durationSeconds": 1600,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DjsXeG7_pCA",
                "durationSeconds": 1569,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ckg7ODDW1pk",
                "durationSeconds": 857,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QOa8nlUYRNo",
                "durationSeconds": 294,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/i4iHuxisRJk",
                "durationSeconds": 918,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/T6bqPqaIiL8",
                "durationSeconds": 1078,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9mDRivx5ZZ4",
                "durationSeconds": 931,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Parte 23",
                "description": "Episódio 23 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jvCzozJUVYM",
                "durationSeconds": 1581,
                "isFree": false
            },
            {
                "number": 24,
                "title": "Parte 24",
                "description": "Episódio 24 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ockpPLli2CE",
                "durationSeconds": 650,
                "isFree": false
            },
            {
                "number": 25,
                "title": "Parte 25",
                "description": "Episódio 25 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/D45IGv3wc7g",
                "durationSeconds": 810,
                "isFree": false
            },
            {
                "number": 26,
                "title": "Parte 26",
                "description": "Episódio 26 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/o5q2bNoO05Q",
                "durationSeconds": 1106,
                "isFree": false
            },
            {
                "number": 27,
                "title": "Parte 27",
                "description": "Episódio 27 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DeY2ndiGobw",
                "durationSeconds": 1150,
                "isFree": false
            },
            {
                "number": 28,
                "title": "Parte 28",
                "description": "Episódio 28 de A Noite do Grande Despertar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xGF58CvmsLQ",
                "durationSeconds": 1353,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-amor-em-retirada",
        "title": "Amor em Retirada",
        "slug": "amor-em-retirada",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Amor em Retirada.",
        "coverUrl": "https://img.youtube.com/vi/Kv_Kfbs-qb0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Kv_Kfbs-qb0/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 15,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34286,
        "likesCount": 12000,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Kv_Kfbs-qb0",
                "durationSeconds": 1291,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uR245ks-IWQ",
                "durationSeconds": 1415,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/99-3FAbRIcE",
                "durationSeconds": 471,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qu3-XSJ2JwQ",
                "durationSeconds": 1380,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WJL2N5gkRqA",
                "durationSeconds": 665,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wv1n6laXzlk",
                "durationSeconds": 1283,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kH67CkOZH84",
                "durationSeconds": 1326,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Cvv-9w824ek",
                "durationSeconds": 1075,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GwSN_RykTcQ",
                "durationSeconds": 1294,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DQ5rrtF1jr0",
                "durationSeconds": 1297,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wOqluitYN1g",
                "durationSeconds": 1273,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zNZ1mD3adBo",
                "durationSeconds": 1132,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gtaXk_V-Blw",
                "durationSeconds": 1271,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9iUma2rfOvw",
                "durationSeconds": 1294,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Amor em Retirada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Sc0yAEDnBQQ",
                "durationSeconds": 1326,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-controladora-que-salvou-o-voo",
        "title": "A Controladora que Salvou o Voo",
        "slug": "a-controladora-que-salvou-o-voo",
        "synopsis": "Acompanhe a emocionante história de A Controladora que Salvou o Voo, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/i9k4_S1hZEY/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/i9k4_S1hZEY/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 21,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 25231,
        "likesCount": 8830,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/i9k4_S1hZEY",
                "durationSeconds": 1661,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/omvHvVSmlhw",
                "durationSeconds": 1654,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MGEWcjbXCFk",
                "durationSeconds": 1661,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_-WeXEBUl0I",
                "durationSeconds": 1668,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PFMVMzG-ZnM",
                "durationSeconds": 1644,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_gIZ2s6MQ8M",
                "durationSeconds": 1408,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PL9bPE8j79E",
                "durationSeconds": 1223,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/22MnrqDSO3E",
                "durationSeconds": 1737,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vOJOe2IkzJk",
                "durationSeconds": 1654,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Fl0LKsYd5do",
                "durationSeconds": 224,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NsKGTsnzBj4",
                "durationSeconds": 323,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LAY8yMDPruI",
                "durationSeconds": 1097,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gLuYE8cCM40",
                "durationSeconds": 1737,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zRH4eiE38Xw",
                "durationSeconds": 1645,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OZkhYy6Fk9E",
                "durationSeconds": 1097,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ooZ22a7PBY4",
                "durationSeconds": 1645,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uS5eigklr3k",
                "durationSeconds": 977,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JBr9GKZc1ko",
                "durationSeconds": 1556,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6BfFwOK_rx8",
                "durationSeconds": 1408,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GW3t0Hi78Zk",
                "durationSeconds": 522,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de A Controladora que Salvou o Voo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1pN20q7ErEA",
                "durationSeconds": 357,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-criada-exclusiva-do-bilionario",
        "title": "A Criada Exclusiva do Bilionário",
        "slug": "a-criada-exclusiva-do-bilionario",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em A Criada Exclusiva do Bilionário.",
        "coverUrl": "https://img.youtube.com/vi/7VENxzaASVQ/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/7VENxzaASVQ/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 20,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 16205,
        "likesCount": 5671,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7VENxzaASVQ",
                "durationSeconds": 787,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HitGdVuIuJ4",
                "durationSeconds": 708,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MSZEJoF2abw",
                "durationSeconds": 406,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nk87Gmbt8Qc",
                "durationSeconds": 711,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_K2eF6FXohs",
                "durationSeconds": 649,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/feEKsDG6NFI",
                "durationSeconds": 243,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nV7JYt_3qBY",
                "durationSeconds": 446,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/w1wI5n-9nJI",
                "durationSeconds": 568,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WAdxa0vNe2E",
                "durationSeconds": 563,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JkWwptNjT38",
                "durationSeconds": 243,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/szxsUm9HQ6Q",
                "durationSeconds": 713,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XBbAz9My0vI",
                "durationSeconds": 672,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/odDwWxAqPpo",
                "durationSeconds": 649,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3shgojv1DS8",
                "durationSeconds": 831,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YczewidxZLY",
                "durationSeconds": 713,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/sD3ycFtNvvo",
                "durationSeconds": 454,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dBPpoBXJUw8",
                "durationSeconds": 838,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nSvNzEAhyPw",
                "durationSeconds": 659,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8tXy9lTcc3Q",
                "durationSeconds": 912,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de A Criada Exclusiva do Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_0k2PoqFZAg",
                "durationSeconds": 322,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-todo-domingo-corro-ate-voce",
        "title": "Todo Domingo Corro Até Você",
        "slug": "todo-domingo-corro-ate-voce",
        "synopsis": "Acompanhe a emocionante história de Todo Domingo Corro Até Você, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/MSlcmBqMqMk/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/MSlcmBqMqMk/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 7,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33558,
        "likesCount": 11745,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Todo Domingo Corro Até Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MSlcmBqMqMk",
                "durationSeconds": 1217,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Todo Domingo Corro Até Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/we9eLfZEK_g",
                "durationSeconds": 818,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Todo Domingo Corro Até Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CaPZTejRcrc",
                "durationSeconds": 1247,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Todo Domingo Corro Até Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xPz1EDxqZR8",
                "durationSeconds": 1145,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Todo Domingo Corro Até Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vZYV0zXTs0M",
                "durationSeconds": 1263,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Todo Domingo Corro Até Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/O6SlzSm2ERg",
                "durationSeconds": 442,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Todo Domingo Corro Até Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZS4BPgv4g5c",
                "durationSeconds": 613,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-bruxa-herdeira-voltou-allison",
        "title": "A Bruxa Herdeira Voltou (Allison)",
        "slug": "a-bruxa-herdeira-voltou-allison",
        "synopsis": "Acompanhe a emocionante história de A Bruxa Herdeira Voltou (Allison), com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/ysWgeGnzpNs/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ysWgeGnzpNs/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 36,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 27872,
        "likesCount": 9755,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ysWgeGnzpNs",
                "durationSeconds": 718,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/sMOVgLzXCtg",
                "durationSeconds": 717,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qjxcGtGaydU",
                "durationSeconds": 779,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YXy6EwRlZ7Y",
                "durationSeconds": 310,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RT3xufkrLc8",
                "durationSeconds": 1796,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/TUnfiCYQj08",
                "durationSeconds": 822,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_DiOfYdzaiE",
                "durationSeconds": 695,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Q25R--80QMk",
                "durationSeconds": 214,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/w0uIBUNjEaQ",
                "durationSeconds": 434,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ErSiZ8RxsZ0",
                "durationSeconds": 1714,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xCzAJaUX-x4",
                "durationSeconds": 1549,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Tg-llDh-K5g",
                "durationSeconds": 701,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/u7bRbepEUlk",
                "durationSeconds": 1774,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/H-kbrh8hOmo",
                "durationSeconds": 721,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xW91p9fmy7o",
                "durationSeconds": 1040,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XjU-1QTXIfo",
                "durationSeconds": 792,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qQmCCNOQXlA",
                "durationSeconds": 1774,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3LDE6JCnNJ8",
                "durationSeconds": 717,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gXmp4CVCXkA",
                "durationSeconds": 717,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/R_JuJdxxylE",
                "durationSeconds": 789,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AIefAqTXY4c",
                "durationSeconds": 1706,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/V7-6iqsEVdI",
                "durationSeconds": 701,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Parte 23",
                "description": "Episódio 23 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tapOp8Iqurw",
                "durationSeconds": 715,
                "isFree": false
            },
            {
                "number": 24,
                "title": "Parte 24",
                "description": "Episódio 24 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0_tMazQlZlk",
                "durationSeconds": 310,
                "isFree": false
            },
            {
                "number": 25,
                "title": "Parte 25",
                "description": "Episódio 25 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/R00NOXKgayk",
                "durationSeconds": 782,
                "isFree": false
            },
            {
                "number": 26,
                "title": "Parte 26",
                "description": "Episódio 26 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nAqHfRsvqac",
                "durationSeconds": 721,
                "isFree": false
            },
            {
                "number": 27,
                "title": "Parte 27",
                "description": "Episódio 27 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/a5igoTgXncA",
                "durationSeconds": 717,
                "isFree": false
            },
            {
                "number": 28,
                "title": "Parte 28",
                "description": "Episódio 28 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bKrBDWD5KKE",
                "durationSeconds": 688,
                "isFree": false
            },
            {
                "number": 29,
                "title": "Parte 29",
                "description": "Episódio 29 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NeOFGgr3af8",
                "durationSeconds": 320,
                "isFree": false
            },
            {
                "number": 30,
                "title": "Parte 30",
                "description": "Episódio 30 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/j022vh1XRV0",
                "durationSeconds": 717,
                "isFree": false
            },
            {
                "number": 31,
                "title": "Parte 31",
                "description": "Episódio 31 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/E3FzFuS0ASI",
                "durationSeconds": 717,
                "isFree": false
            },
            {
                "number": 32,
                "title": "Parte 32",
                "description": "Episódio 32 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AYJgDgvLBJM",
                "durationSeconds": 715,
                "isFree": false
            },
            {
                "number": 33,
                "title": "Parte 33",
                "description": "Episódio 33 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hZRhyyjJg54",
                "durationSeconds": 776,
                "isFree": false
            },
            {
                "number": 34,
                "title": "Parte 34",
                "description": "Episódio 34 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RbXzFA7MzlQ",
                "durationSeconds": 717,
                "isFree": false
            },
            {
                "number": 35,
                "title": "Parte 35",
                "description": "Episódio 35 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BRSe-8JhQSk",
                "durationSeconds": 717,
                "isFree": false
            },
            {
                "number": 36,
                "title": "Parte 36",
                "description": "Episódio 36 de A Bruxa Herdeira Voltou (Allison) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ccn6WoAYZGg",
                "durationSeconds": 717,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-esperma-errado-amor-certo",
        "title": "Esperma Errado Amor Certo",
        "slug": "esperma-errado-amor-certo",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Esperma Errado Amor Certo.",
        "coverUrl": "https://img.youtube.com/vi/QXDnL8fGa_Y/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/QXDnL8fGa_Y/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 12624,
        "likesCount": 4418,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Esperma Errado Amor Certo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QXDnL8fGa_Y",
                "durationSeconds": 638,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Esperma Errado Amor Certo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5MIW5CBIesI",
                "durationSeconds": 651,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Esperma Errado Amor Certo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Jtu7MdyoBaw",
                "durationSeconds": 213,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Esperma Errado Amor Certo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Vy1KlLmfHZI",
                "durationSeconds": 454,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Esperma Errado Amor Certo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/yBptdwTiUMM",
                "durationSeconds": 768,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Esperma Errado Amor Certo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/joeJtKQ38qk",
                "durationSeconds": 727,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Esperma Errado Amor Certo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8BtbBdKNXTY",
                "durationSeconds": 341,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Esperma Errado Amor Certo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Em8rtSfWwfI",
                "durationSeconds": 551,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Esperma Errado Amor Certo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NJCUC7EfyYw",
                "durationSeconds": 786,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-traido-pelos-que-amava",
        "title": "Traído Pelos Que Amava",
        "slug": "traido-pelos-que-amava",
        "synopsis": "Acompanhe a emocionante história de Traído Pelos Que Amava, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/V5KvCvGDggo/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/V5KvCvGDggo/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32329,
        "likesCount": 11315,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Traído Pelos Que Amava completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/V5KvCvGDggo",
                "durationSeconds": 1252,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Traído Pelos Que Amava completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YxG_ScVvyJk",
                "durationSeconds": 1792,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Traído Pelos Que Amava completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mQ9lbx383vg",
                "durationSeconds": 1258,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Traído Pelos Que Amava completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/o9ag3p0x_dU",
                "durationSeconds": 822,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Traído Pelos Que Amava completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fnSMsJPodUA",
                "durationSeconds": 1641,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Traído Pelos Que Amava completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/f93kqFgNVxc",
                "durationSeconds": 2518,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Traído Pelos Que Amava completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JrhcDLN_mGc",
                "durationSeconds": 2960,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Traído Pelos Que Amava completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fg6-geTanLA",
                "durationSeconds": 2541,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Traído Pelos Que Amava completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RW08AJ0qSo0",
                "durationSeconds": 2428,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Traído Pelos Que Amava completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_LFbgK2QnCw",
                "durationSeconds": 2541,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-marcada-pelo-meu-meio-irmao-alfa",
        "title": "Marcada pelo Meu Meio-Irmão Alfa",
        "slug": "marcada-pelo-meu-meio-irmao-alfa",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em Marcada pelo Meu Meio-Irmão Alfa.",
        "coverUrl": "https://img.youtube.com/vi/vfaSYc3oG7s/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/vfaSYc3oG7s/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 13,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 30126,
        "likesCount": 10544,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vfaSYc3oG7s",
                "durationSeconds": 383,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9Hd0TCmUmmc",
                "durationSeconds": 995,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/T_5UmAFI8z0",
                "durationSeconds": 1023,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LfYQqkJTY-8",
                "durationSeconds": 1089,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1Zk6yg7EIgU",
                "durationSeconds": 1036,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AmYXrHyCqZc",
                "durationSeconds": 1102,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9O3btK82Lwg",
                "durationSeconds": 1094,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/N6ITNDRnjDI",
                "durationSeconds": 1256,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GjLQh6XObOs",
                "durationSeconds": 897,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/95NGcPTpr7Q",
                "durationSeconds": 383,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hUzhlZlux0w",
                "durationSeconds": 466,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tnZtGz6TBfE",
                "durationSeconds": 1525,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Marcada pelo Meu Meio-Irmão Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2j5KWChn9zE",
                "durationSeconds": 1555,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-no-ritmo-de-um-bom-amor",
        "title": "No Ritmo de um Bom Amor",
        "slug": "no-ritmo-de-um-bom-amor",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em No Ritmo de um Bom Amor.",
        "coverUrl": "https://img.youtube.com/vi/s6ED2V66ovg/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/s6ED2V66ovg/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 16,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 8960,
        "likesCount": 3136,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/s6ED2V66ovg",
                "durationSeconds": 1338,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UFuyQGjhURE",
                "durationSeconds": 1375,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9NRl0gRwoaQ",
                "durationSeconds": 1370,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/n7msKIDKop4",
                "durationSeconds": 962,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/P7vM4Equtdo",
                "durationSeconds": 1281,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7gc_hxVe9jo",
                "durationSeconds": 1497,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hLZRVxLkIKQ",
                "durationSeconds": 1370,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rhHBiSi-iPs",
                "durationSeconds": 1758,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lKpUiQ3oMB8",
                "durationSeconds": 278,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IKJ0vgsKR8E",
                "durationSeconds": 852,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fnhakgoZfBE",
                "durationSeconds": 334,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eUmCop2O6_g",
                "durationSeconds": 867,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YH1EGq1HDsM",
                "durationSeconds": 1337,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GPIsFMd6nRM",
                "durationSeconds": 811,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vI8fpPheF0E",
                "durationSeconds": 2017,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de No Ritmo de um Bom Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/TMUueRe76-Q",
                "durationSeconds": 2088,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-drama-do-banquete-de-noivado",
        "title": "O Drama do Banquete de Noivado",
        "slug": "o-drama-do-banquete-de-noivado",
        "synopsis": "Um matrimônio selado por conveniência e obrigações familiares esconde sentimentos intensos e segredos proibidos em O Drama do Banquete de Noivado.",
        "coverUrl": "https://img.youtube.com/vi/eOtymLeuHfk/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/eOtymLeuHfk/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,casamento-arranjado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 30623,
        "likesCount": 10718,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Drama do Banquete de Noivado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eOtymLeuHfk",
                "durationSeconds": 431,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Drama do Banquete de Noivado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5qtDZ9DMArQ",
                "durationSeconds": 1036,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Drama do Banquete de Noivado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zK57mqReFUU",
                "durationSeconds": 908,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Drama do Banquete de Noivado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MQs73i06XV8",
                "durationSeconds": 1112,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Drama do Banquete de Noivado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/imOfPsd-zCY",
                "durationSeconds": 448,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Drama do Banquete de Noivado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YyxL9i2xcmU",
                "durationSeconds": 848,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Drama do Banquete de Noivado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/aMYys86cPvk",
                "durationSeconds": 1152,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de O Drama do Banquete de Noivado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZK3WocxMX8k",
                "durationSeconds": 423,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de O Drama do Banquete de Noivado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/G1LQ4w6xfOU",
                "durationSeconds": 415,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de O Drama do Banquete de Noivado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GBqDn6QqDts",
                "durationSeconds": 455,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-morto-por-amor-vivo-por-odio",
        "title": "Morto por Amor Vivo por Ódio",
        "slug": "morto-por-amor-vivo-por-odio",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Morto por Amor Vivo por Ódio.",
        "coverUrl": "https://img.youtube.com/vi/am1w2nzVC8w/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/am1w2nzVC8w/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 15,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31946,
        "likesCount": 11181,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/am1w2nzVC8w",
                "durationSeconds": 267,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/14pjbBxeXzc",
                "durationSeconds": 815,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4N8ptVyJRcg",
                "durationSeconds": 1432,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/I8edt8E3jDA",
                "durationSeconds": 819,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Wiq7Hi8txXQ",
                "durationSeconds": 817,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wtOrxKkU8M4",
                "durationSeconds": 1319,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EDflYcxVYrs",
                "durationSeconds": 458,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UautO9ASnA0",
                "durationSeconds": 256,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cEQVPDVWQbs",
                "durationSeconds": 1923,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rbCea_nUepI",
                "durationSeconds": 508,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nxlrfSkrnHw",
                "durationSeconds": 1432,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vzKTb_P23T4",
                "durationSeconds": 727,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZlpAuUARj0Q",
                "durationSeconds": 816,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/b6FGm-CIGyg",
                "durationSeconds": 816,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Morto por Amor Vivo por Ódio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/sbes-qcQlhw",
                "durationSeconds": 817,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-cuidado-a-herdeira-voltou",
        "title": "Cuidado, a Herdeira Voltou",
        "slug": "cuidado-a-herdeira-voltou",
        "synopsis": "Acompanhe a emocionante história de Cuidado, a Herdeira Voltou, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/rtmec_z_JZM/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/rtmec_z_JZM/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 11712,
        "likesCount": 4099,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Cuidado, a Herdeira Voltou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rtmec_z_JZM",
                "durationSeconds": 1326,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Cuidado, a Herdeira Voltou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EsL0bluK9sw",
                "durationSeconds": 1238,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Cuidado, a Herdeira Voltou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_la8zLvPZuY",
                "durationSeconds": 566,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Cuidado, a Herdeira Voltou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Y7h7McWyJXA",
                "durationSeconds": 1326,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Cuidado, a Herdeira Voltou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AAsmAin0N94",
                "durationSeconds": 1541,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Cuidado, a Herdeira Voltou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DEIi5b1xGNk",
                "durationSeconds": 1238,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Cuidado, a Herdeira Voltou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Q4v1OHWQUS0",
                "durationSeconds": 1584,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Cuidado, a Herdeira Voltou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kXAenFhARrs",
                "durationSeconds": 1255,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Cuidado, a Herdeira Voltou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Od5ZrzEGCrc",
                "durationSeconds": 1656,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Cuidado, a Herdeira Voltou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/oAyRgpJTluw",
                "durationSeconds": 1584,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-zelador-herdeiro-bilionario-jack",
        "title": "O Zelador Herdeiro Bilionário (Jack)",
        "slug": "o-zelador-herdeiro-bilionario-jack",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em O Zelador Herdeiro Bilionário (Jack).",
        "coverUrl": "https://img.youtube.com/vi/ICycAYpJ7II/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ICycAYpJ7II/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 16,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 28474,
        "likesCount": 9965,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ICycAYpJ7II",
                "durationSeconds": 1441,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DQ_agFbkfeU",
                "durationSeconds": 1291,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9An2d9MQa84",
                "durationSeconds": 1600,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/V07baQqtAew",
                "durationSeconds": 1442,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bE9SvFjR9cg",
                "durationSeconds": 1441,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0Md93PLXrMk",
                "durationSeconds": 1442,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ypVp--D7h70",
                "durationSeconds": 1077,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DcI0gZnV_S4",
                "durationSeconds": 1525,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/w3WY65o43L8",
                "durationSeconds": 1533,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/TWAJ3MsVvVE",
                "durationSeconds": 273,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/v_CX_Bi_F5g",
                "durationSeconds": 274,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zQrjDLmlC_E",
                "durationSeconds": 705,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-Nlx5jQK3oA",
                "durationSeconds": 1077,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Fcx2c3qdfkw",
                "durationSeconds": 1818,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/18V_Wgwn29c",
                "durationSeconds": 1533,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de O Zelador Herdeiro Bilionário (Jack) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9apMJ4snet0",
                "durationSeconds": 1640,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-28-dias-com-o-alfa",
        "title": "28 Dias com o Alfa",
        "slug": "28-dias-com-o-alfa",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em 28 Dias com o Alfa.",
        "coverUrl": "https://img.youtube.com/vi/no8GyuyCBkA/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/no8GyuyCBkA/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 20,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33297,
        "likesCount": 11653,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/no8GyuyCBkA",
                "durationSeconds": 842,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7ZLlRnvnMQg",
                "durationSeconds": 780,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SwIjf583kAg",
                "durationSeconds": 868,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YiTOp2IpwQo",
                "durationSeconds": 668,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Uin67H61_wo",
                "durationSeconds": 783,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jKMvoZ_yO9A",
                "durationSeconds": 524,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/I48mXoiZ54M",
                "durationSeconds": 796,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zAkEnUGG3IA",
                "durationSeconds": 981,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8XNWas43xog",
                "durationSeconds": 867,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0Rt6ASpUxXA",
                "durationSeconds": 736,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GLR43qhUPKk",
                "durationSeconds": 852,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3ZldgCT_fyA",
                "durationSeconds": 760,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/sQ_rC7mE0HA",
                "durationSeconds": 722,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VrLTos_6BwQ",
                "durationSeconds": 816,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OMAbWvHeO04",
                "durationSeconds": 790,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GKSMlRKbq6s",
                "durationSeconds": 1354,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/c0FXUjMip9E",
                "durationSeconds": 822,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nnZWbSiIi4c",
                "durationSeconds": 842,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/L-YbgUok6p0",
                "durationSeconds": 802,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de 28 Dias com o Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7itxzYPVlvg",
                "durationSeconds": 768,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-adeus-ao-passado-ola-ao-amor",
        "title": "Adeus ao Passado Olá ao Amor",
        "slug": "adeus-ao-passado-ola-ao-amor",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Adeus ao Passado Olá ao Amor.",
        "coverUrl": "https://img.youtube.com/vi/8syC5zHoiCw/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/8syC5zHoiCw/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 15321,
        "likesCount": 5362,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Adeus ao Passado Olá ao Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8syC5zHoiCw",
                "durationSeconds": 252,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Adeus ao Passado Olá ao Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YJlGwfYRZNI",
                "durationSeconds": 948,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Adeus ao Passado Olá ao Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vL8waX1BWtU",
                "durationSeconds": 1092,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Adeus ao Passado Olá ao Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Xk_DOw7aCsQ",
                "durationSeconds": 903,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Adeus ao Passado Olá ao Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LgSh2MBGTW8",
                "durationSeconds": 978,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Adeus ao Passado Olá ao Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ryx3g3zF_WU",
                "durationSeconds": 918,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Adeus ao Passado Olá ao Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Oj4EFKzcepk",
                "durationSeconds": 853,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Adeus ao Passado Olá ao Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uFw3dHJe314",
                "durationSeconds": 271,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Adeus ao Passado Olá ao Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gPqd8K4Y4Xk",
                "durationSeconds": 884,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-sem-olhar-para-tras",
        "title": "Sem Olhar para Trás",
        "slug": "sem-olhar-para-tras",
        "synopsis": "Acompanhe a emocionante história de Sem Olhar para Trás, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/qStdw1zfebQ/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/qStdw1zfebQ/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 25925,
        "likesCount": 9073,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Sem Olhar para Trás completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qStdw1zfebQ",
                "durationSeconds": 1135,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Sem Olhar para Trás completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/j630RFUPgNk",
                "durationSeconds": 1088,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Sem Olhar para Trás completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Mh5orWG8SB0",
                "durationSeconds": 1103,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Sem Olhar para Trás completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1hb2halM884",
                "durationSeconds": 959,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Sem Olhar para Trás completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/oqDKI_bo_uM",
                "durationSeconds": 1160,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-herdeira-presa-sem-braco",
        "title": "A Herdeira Presa Sem Braço",
        "slug": "a-herdeira-presa-sem-braco",
        "synopsis": "Acompanhe a emocionante história de A Herdeira Presa Sem Braço, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/ScZ1uynn7zc/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ScZ1uynn7zc/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 47,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34152,
        "likesCount": 11953,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ScZ1uynn7zc",
                "durationSeconds": 981,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/z2Y-4CIMTJY",
                "durationSeconds": 419,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CE89XL1Dy5c",
                "durationSeconds": 459,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/oAg2H-rc93U",
                "durationSeconds": 1075,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SCzSGzgphEo",
                "durationSeconds": 237,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_l7g9H5-Z5g",
                "durationSeconds": 237,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/L2M5DJ2JEuI",
                "durationSeconds": 1075,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MTTRvBrXA90",
                "durationSeconds": 1075,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xaZf7TmNW5E",
                "durationSeconds": 212,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HWl0i71Prb8",
                "durationSeconds": 212,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ltvk3lKDcRo",
                "durationSeconds": 1072,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ebc5c7Yz8jA",
                "durationSeconds": 960,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qPsYXwClFXI",
                "durationSeconds": 1071,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/l8xBIr8JQXU",
                "durationSeconds": 929,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2kG_72fsGaM",
                "durationSeconds": 1075,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LtDfaN3R8jA",
                "durationSeconds": 237,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PxVnn5b2EZE",
                "durationSeconds": 226,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9UCqZai8gZg",
                "durationSeconds": 249,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/M2JOXw-aXJk",
                "durationSeconds": 250,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VDK_5fO5E6Q",
                "durationSeconds": 922,
                "isFree": false
            },
            {
                "number": 21,
                "title": "Parte 21",
                "description": "Episódio 21 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fFlJDKk-pJM",
                "durationSeconds": 780,
                "isFree": false
            },
            {
                "number": 22,
                "title": "Parte 22",
                "description": "Episódio 22 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/d-0x8o-pKok",
                "durationSeconds": 237,
                "isFree": false
            },
            {
                "number": 23,
                "title": "Parte 23",
                "description": "Episódio 23 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/w3gC_Qy6gsE",
                "durationSeconds": 229,
                "isFree": false
            },
            {
                "number": 24,
                "title": "Parte 24",
                "description": "Episódio 24 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/t86qImZINUM",
                "durationSeconds": 1028,
                "isFree": false
            },
            {
                "number": 25,
                "title": "Parte 25",
                "description": "Episódio 25 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/H7Jtfv8uM4M",
                "durationSeconds": 1603,
                "isFree": false
            },
            {
                "number": 26,
                "title": "Parte 26",
                "description": "Episódio 26 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XRoXSvKnOSY",
                "durationSeconds": 190,
                "isFree": false
            },
            {
                "number": 27,
                "title": "Parte 27",
                "description": "Episódio 27 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LK3lnqIZ0L8",
                "durationSeconds": 216,
                "isFree": false
            },
            {
                "number": 28,
                "title": "Parte 28",
                "description": "Episódio 28 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vn7J-n7f6xo",
                "durationSeconds": 1480,
                "isFree": false
            },
            {
                "number": 29,
                "title": "Parte 29",
                "description": "Episódio 29 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_G_9otrdW0k",
                "durationSeconds": 1174,
                "isFree": false
            },
            {
                "number": 30,
                "title": "Parte 30",
                "description": "Episódio 30 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4xZfnk94sQk",
                "durationSeconds": 209,
                "isFree": false
            },
            {
                "number": 31,
                "title": "Parte 31",
                "description": "Episódio 31 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/474h2S8TV4A",
                "durationSeconds": 237,
                "isFree": false
            },
            {
                "number": 32,
                "title": "Parte 32",
                "description": "Episódio 32 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rhnNyHoTcYA",
                "durationSeconds": 1075,
                "isFree": false
            },
            {
                "number": 33,
                "title": "Parte 33",
                "description": "Episódio 33 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VAPDrBsAbvE",
                "durationSeconds": 419,
                "isFree": false
            },
            {
                "number": 34,
                "title": "Parte 34",
                "description": "Episódio 34 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Xs59WREhhNg",
                "durationSeconds": 1071,
                "isFree": false
            },
            {
                "number": 35,
                "title": "Parte 35",
                "description": "Episódio 35 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/474tdZDoku8",
                "durationSeconds": 250,
                "isFree": false
            },
            {
                "number": 36,
                "title": "Parte 36",
                "description": "Episódio 36 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xi5EW1dZojQ",
                "durationSeconds": 216,
                "isFree": false
            },
            {
                "number": 37,
                "title": "Parte 37",
                "description": "Episódio 37 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xZcNPzOH--0",
                "durationSeconds": 586,
                "isFree": false
            },
            {
                "number": 38,
                "title": "Parte 38",
                "description": "Episódio 38 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_b17fHIPrPg",
                "durationSeconds": 1669,
                "isFree": false
            },
            {
                "number": 39,
                "title": "Parte 39",
                "description": "Episódio 39 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9es9P_q3iFQ",
                "durationSeconds": 208,
                "isFree": false
            },
            {
                "number": 40,
                "title": "Parte 40",
                "description": "Episódio 40 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tC4nZUDe05w",
                "durationSeconds": 1576,
                "isFree": false
            },
            {
                "number": 41,
                "title": "Parte 41",
                "description": "Episódio 41 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/KyvaOa6Lngc",
                "durationSeconds": 1075,
                "isFree": false
            },
            {
                "number": 42,
                "title": "Parte 42",
                "description": "Episódio 42 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/M521V2vHEN4",
                "durationSeconds": 1075,
                "isFree": false
            },
            {
                "number": 43,
                "title": "Parte 43",
                "description": "Episódio 43 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Vfg5PaxQ-HE",
                "durationSeconds": 230,
                "isFree": false
            },
            {
                "number": 44,
                "title": "Parte 44",
                "description": "Episódio 44 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9M6gowviJaY",
                "durationSeconds": 430,
                "isFree": false
            },
            {
                "number": 45,
                "title": "Parte 45",
                "description": "Episódio 45 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5Bzm7gcFYf4",
                "durationSeconds": 252,
                "isFree": false
            },
            {
                "number": 46,
                "title": "Parte 46",
                "description": "Episódio 46 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JzO3w3rvtI8",
                "durationSeconds": 1060,
                "isFree": false
            },
            {
                "number": 47,
                "title": "Parte 47",
                "description": "Episódio 47 de A Herdeira Presa Sem Braço completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4PRaKAAhCmM",
                "durationSeconds": 2104,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-menina-que-fala-com-animais",
        "title": "A Menina que Fala com Animais",
        "slug": "a-menina-que-fala-com-animais",
        "synopsis": "Acompanhe a emocionante história de A Menina que Fala com Animais, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/6_7GF2Pdi0k/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/6_7GF2Pdi0k/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 18794,
        "likesCount": 6577,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Menina que Fala com Animais completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6_7GF2Pdi0k",
                "durationSeconds": 912,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Menina que Fala com Animais completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BbT4wX7KjwI",
                "durationSeconds": 912,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Menina que Fala com Animais completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mnSoU_fshA4",
                "durationSeconds": 912,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Menina que Fala com Animais completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/N9kzZiTyNog",
                "durationSeconds": 912,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Menina que Fala com Animais completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BbT88ITSgnE",
                "durationSeconds": 829,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Menina que Fala com Animais completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-tTRpXkHbs4",
                "durationSeconds": 1137,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Menina que Fala com Animais completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3xiRCBN5aEQ",
                "durationSeconds": 241,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de A Menina que Fala com Animais completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GSPZDt8wWR0",
                "durationSeconds": 382,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de A Menina que Fala com Animais completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8olh1Xr9-Lc",
                "durationSeconds": 1078,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-noiva-enganada",
        "title": "A Noiva Enganada",
        "slug": "a-noiva-enganada",
        "synopsis": "Um matrimônio selado por conveniência e obrigações familiares esconde sentimentos intensos e segredos proibidos em A Noiva Enganada.",
        "coverUrl": "https://img.youtube.com/vi/iENB5udNE2g/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/iENB5udNE2g/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,casamento-arranjado,romance,drama",
        "totalEpisodes": 15,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 23028,
        "likesCount": 8059,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/iENB5udNE2g",
                "durationSeconds": 1308,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/x4OmLvBRwLY",
                "durationSeconds": 1182,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/V76IxZjbOL8",
                "durationSeconds": 1364,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/pHmTtqz6Tqc",
                "durationSeconds": 1068,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gCaGuQdQ-8o",
                "durationSeconds": 1108,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5g9N4JIskVs",
                "durationSeconds": 551,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OpoIct2pXBc",
                "durationSeconds": 1294,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/024xn12vo_M",
                "durationSeconds": 1250,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dHTMWiLm1AY",
                "durationSeconds": 349,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/s4hBcfzUmpo",
                "durationSeconds": 984,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BRfzYFS-TJg",
                "durationSeconds": 1327,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tDpY-kZH7VU",
                "durationSeconds": 856,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FJ_gA0SAk8c",
                "durationSeconds": 1254,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wJbTtJmLx80",
                "durationSeconds": 1314,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de A Noiva Enganada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ke4vtV2ELTI",
                "durationSeconds": 1483,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-ferreiro-rei-demonio",
        "title": "O Ferreiro Rei Demônio",
        "slug": "o-ferreiro-rei-demonio",
        "synopsis": "Acompanhe a emocionante história de O Ferreiro Rei Demônio, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/aAoH11Ec6pU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/aAoH11Ec6pU/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34493,
        "likesCount": 12072,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Ferreiro Rei Demônio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/aAoH11Ec6pU",
                "durationSeconds": 1391,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Ferreiro Rei Demônio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nY4p_PV6en0",
                "durationSeconds": 1433,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Ferreiro Rei Demônio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ikCswhyiuMw",
                "durationSeconds": 1418,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Ferreiro Rei Demônio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8YGnAMVDAVw",
                "durationSeconds": 370,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Ferreiro Rei Demônio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YYNozQOsntE",
                "durationSeconds": 1418,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Ferreiro Rei Demônio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QB_omT9VRRw",
                "durationSeconds": 803,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Ferreiro Rei Demônio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cKmll_hbiyI",
                "durationSeconds": 1043,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de O Ferreiro Rei Demônio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WLKl5CaY2kg",
                "durationSeconds": 1176,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de O Ferreiro Rei Demônio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5LaEz9Umcz0",
                "durationSeconds": 924,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-herdeira-encantada-voltou",
        "title": "A Herdeira Encantada Voltou!",
        "slug": "a-herdeira-encantada-voltou",
        "synopsis": "Acompanhe a emocionante história de A Herdeira Encantada Voltou!, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/ciX1Iyh1H94/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ciX1Iyh1H94/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 22060,
        "likesCount": 7720,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Herdeira Encantada Voltou! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ciX1Iyh1H94",
                "durationSeconds": 1714,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Herdeira Encantada Voltou! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YqAeuLyMU0I",
                "durationSeconds": 701,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-meu-ceo-meu-milagre",
        "title": "Meu CEO Meu Milagre",
        "slug": "meu-ceo-meu-milagre",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em Meu CEO Meu Milagre.",
        "coverUrl": "https://img.youtube.com/vi/IvmFw1T7fDs/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/IvmFw1T7fDs/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 19840,
        "likesCount": 6944,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Meu CEO Meu Milagre completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IvmFw1T7fDs",
                "durationSeconds": 850,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Meu CEO Meu Milagre completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/S5eT7U4rwmM",
                "durationSeconds": 811,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Meu CEO Meu Milagre completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/F8nvT0YDqwY",
                "durationSeconds": 1147,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Meu CEO Meu Milagre completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9iPAKfQioSI",
                "durationSeconds": 387,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Meu CEO Meu Milagre completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CPhAb9hnVXk",
                "durationSeconds": 1094,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-de-envenenada-a-inimiga-implacavel",
        "title": "De Envenenada a Inimiga Implacável",
        "slug": "de-envenenada-a-inimiga-implacavel",
        "synopsis": "Acompanhe a emocionante história de De Envenenada a Inimiga Implacável, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/yuyrd1so_ik/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/yuyrd1so_ik/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 14,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34314,
        "likesCount": 12009,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/yuyrd1so_ik",
                "durationSeconds": 1296,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Y9JamaEtIBA",
                "durationSeconds": 1309,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wPSTzH-791A",
                "durationSeconds": 1333,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Sx1CT3whzzc",
                "durationSeconds": 1275,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vWnjji3tKG4",
                "durationSeconds": 250,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/yAHw1a6QzUA",
                "durationSeconds": 1297,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UUgrNdkeM3M",
                "durationSeconds": 1312,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1tiowOWrzJQ",
                "durationSeconds": 1266,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6CdiARZkTIY",
                "durationSeconds": 1302,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xyBQCpVDl40",
                "durationSeconds": 1315,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8Kr2yNtdRm0",
                "durationSeconds": 808,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6IwRNBZZ1Lk",
                "durationSeconds": 361,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/axutkho9O54",
                "durationSeconds": 1259,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de De Envenenada a Inimiga Implacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/d3yZkolOVcs",
                "durationSeconds": 1002,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-nao-mexa-com-a-pequena",
        "title": "Não Mexa com a Pequena",
        "slug": "nao-mexa-com-a-pequena",
        "synopsis": "Acompanhe a emocionante história de Não Mexa com a Pequena, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/4aJPvWo021Q/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/4aJPvWo021Q/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 7,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 25055,
        "likesCount": 8769,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Não Mexa com a Pequena completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4aJPvWo021Q",
                "durationSeconds": 833,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Não Mexa com a Pequena completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/o0K_DvbL00I",
                "durationSeconds": 297,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Não Mexa com a Pequena completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DKuw4BR7FUk",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Não Mexa com a Pequena completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XGpkFbbBTN0",
                "durationSeconds": 198,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Não Mexa com a Pequena completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6XFHvbYAOPQ",
                "durationSeconds": 1261,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Não Mexa com a Pequena completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uC8VlRo2RLY",
                "durationSeconds": 199,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Não Mexa com a Pequena completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5o1ktT3oFwo",
                "durationSeconds": 439,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-do-servico-ao-sucesso",
        "title": "Do Serviço ao Sucesso",
        "slug": "do-servico-ao-sucesso",
        "synopsis": "Acompanhe a emocionante história de Do Serviço ao Sucesso, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/CXkfJrZfVkQ/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/CXkfJrZfVkQ/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 16425,
        "likesCount": 5748,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Do Serviço ao Sucesso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CXkfJrZfVkQ",
                "durationSeconds": 198,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-meu-sim-ao-rei-da-mafia",
        "title": "Meu Sim ao Rei da Máfia",
        "slug": "meu-sim-ao-rei-da-mafia",
        "synopsis": "Em um submundo dominado pelo poder e perigo das famílias mafiosas, segredos do passado e uma atração irresistível colocam vidas em jogo em Meu Sim ao Rei da Máfia.",
        "coverUrl": "https://img.youtube.com/vi/Ax9CsuRQAf8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Ax9CsuRQAf8/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,mafia,suspense,romance,drama",
        "totalEpisodes": 15,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33619,
        "likesCount": 11766,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ax9CsuRQAf8",
                "durationSeconds": 208,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bbkbdOarBnE",
                "durationSeconds": 656,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bzcPwPm8cNs",
                "durationSeconds": 943,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tZyr9Tnp6Is",
                "durationSeconds": 951,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/A9QG5lK6Esk",
                "durationSeconds": 944,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/W3DaS2hn42Q",
                "durationSeconds": 936,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/grjWQd1NBGQ",
                "durationSeconds": 963,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_KMh7JFSloI",
                "durationSeconds": 1292,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/75Eauc9uK7o",
                "durationSeconds": 1333,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bBFL3W_onpg",
                "durationSeconds": 684,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uk32zuVV0wE",
                "durationSeconds": 936,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kjtPzqD1PRc",
                "durationSeconds": 836,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kZ2QWY9lC_k",
                "durationSeconds": 1423,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MUxP03WG4OU",
                "durationSeconds": 1256,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Meu Sim ao Rei da Máfia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VBsvcXFotfU",
                "durationSeconds": 936,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-bebe-secreto-do-rei-alfa",
        "title": "O Bebê Secreto do Rei Alfa",
        "slug": "o-bebe-secreto-do-rei-alfa",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em O Bebê Secreto do Rei Alfa.",
        "coverUrl": "https://img.youtube.com/vi/ehOhf4pCVMk/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ehOhf4pCVMk/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 27718,
        "likesCount": 9701,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Bebê Secreto do Rei Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ehOhf4pCVMk",
                "durationSeconds": 1153,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Bebê Secreto do Rei Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wTfufj5WA5w",
                "durationSeconds": 965,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Bebê Secreto do Rei Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/KRe0LdiIhrs",
                "durationSeconds": 999,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-de-ninguem-a-queridinha-dele",
        "title": "De Ninguém a Queridinha Dele",
        "slug": "de-ninguem-a-queridinha-dele",
        "synopsis": "Acompanhe a emocionante história de De Ninguém a Queridinha Dele, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/MWpY4N1pVRE/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/MWpY4N1pVRE/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 12851,
        "likesCount": 4497,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de De Ninguém a Queridinha Dele completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MWpY4N1pVRE",
                "durationSeconds": 1512,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-credito-roubado-amor-perdido",
        "title": "Crédito Roubado Amor Perdido",
        "slug": "credito-roubado-amor-perdido",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Crédito Roubado Amor Perdido.",
        "coverUrl": "https://img.youtube.com/vi/E2El-Ozz1K8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/E2El-Ozz1K8/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 8,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32420,
        "likesCount": 11347,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Crédito Roubado Amor Perdido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/E2El-Ozz1K8",
                "durationSeconds": 678,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Crédito Roubado Amor Perdido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Qt6n5_Kb96o",
                "durationSeconds": 606,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Crédito Roubado Amor Perdido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mMDlEJIl3lw",
                "durationSeconds": 797,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Crédito Roubado Amor Perdido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VCPDA0bgAXA",
                "durationSeconds": 841,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Crédito Roubado Amor Perdido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/yCbEwJnSNF4",
                "durationSeconds": 778,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Crédito Roubado Amor Perdido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/b4GbS0qFPjk",
                "durationSeconds": 900,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Crédito Roubado Amor Perdido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nBwpbuWVZRY",
                "durationSeconds": 518,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Crédito Roubado Amor Perdido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/edaa8ha74xA",
                "durationSeconds": 523,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-vinganca-de-sangue-a-justica-da-irma",
        "title": "Vingança de Sangue: A Justiça da Irmã",
        "slug": "vinganca-de-sangue-a-justica-da-irma",
        "synopsis": "Humilhado no passado, o retorno triunfal para cobrar cada dívida e proteger quem ama abala as estruturas de todos os traidores em Vingança de Sangue: A Justiça da Irmã.",
        "coverUrl": "https://img.youtube.com/vi/5kPkEC_DDs4/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/5kPkEC_DDs4/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,vinganca,poder,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 29997,
        "likesCount": 10498,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Vingança de Sangue: A Justiça da Irmã completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5kPkEC_DDs4",
                "durationSeconds": 1328,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Vingança de Sangue: A Justiça da Irmã completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QpsbgVg1d60",
                "durationSeconds": 1585,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Vingança de Sangue: A Justiça da Irmã completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0Nw4V8OFC_g",
                "durationSeconds": 1118,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Vingança de Sangue: A Justiça da Irmã completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Po7tYEJq6Yo",
                "durationSeconds": 1371,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-toque-que-me-salvou",
        "title": "O Toque que Me Salvou",
        "slug": "o-toque-que-me-salvou",
        "synopsis": "Acompanhe a emocionante história de O Toque que Me Salvou, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/5JuKq1k-w7Q/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/5JuKq1k-w7Q/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 9190,
        "likesCount": 3216,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Toque que Me Salvou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5JuKq1k-w7Q",
                "durationSeconds": 1484,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Toque que Me Salvou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JzLZ4EvlT4k",
                "durationSeconds": 1449,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Toque que Me Salvou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SQo2_7C3d14",
                "durationSeconds": 1272,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Toque que Me Salvou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AvEVrgpUdog",
                "durationSeconds": 1295,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Toque que Me Salvou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RVLyeopHsP0",
                "durationSeconds": 622,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Toque que Me Salvou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4FuonlcPG04",
                "durationSeconds": 1293,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Toque que Me Salvou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RsuqiA-_Ew8",
                "durationSeconds": 1093,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de O Toque que Me Salvou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UlB910HJrcs",
                "durationSeconds": 1313,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de O Toque que Me Salvou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/81-cXgoPoaI",
                "durationSeconds": 1345,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-dinheiro-caindo-sem-fim",
        "title": "Dinheiro Caindo Sem Fim",
        "slug": "dinheiro-caindo-sem-fim",
        "synopsis": "Acompanhe a emocionante história de Dinheiro Caindo Sem Fim, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/wx7nUF8budU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/wx7nUF8budU/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 30743,
        "likesCount": 10760,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Dinheiro Caindo Sem Fim completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wx7nUF8budU",
                "durationSeconds": 912,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Dinheiro Caindo Sem Fim completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nx2DyqU-214",
                "durationSeconds": 604,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Dinheiro Caindo Sem Fim completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9XuNBoJw3kI",
                "durationSeconds": 1348,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-meu-dom-da-riqueza",
        "title": "Meu Dom da Riqueza",
        "slug": "meu-dom-da-riqueza",
        "synopsis": "Acompanhe a emocionante história de Meu Dom da Riqueza, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/xSC6GZlCAQo/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/xSC6GZlCAQo/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 12,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31846,
        "likesCount": 11146,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Meu Dom da Riqueza completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xSC6GZlCAQo",
                "durationSeconds": 1327,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Meu Dom da Riqueza completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3zablaYHrDg",
                "durationSeconds": 2268,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Meu Dom da Riqueza completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/75f86RCpbrE",
                "durationSeconds": 1347,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Meu Dom da Riqueza completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WLnswxPlv5U",
                "durationSeconds": 744,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Meu Dom da Riqueza completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6r9F-4XO9e4",
                "durationSeconds": 2352,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Meu Dom da Riqueza completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YiOAnCzC900",
                "durationSeconds": 762,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Meu Dom da Riqueza completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hXl-t7mn0RI",
                "durationSeconds": 925,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Meu Dom da Riqueza completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/j-pLNVCKBjA",
                "durationSeconds": 2161,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Meu Dom da Riqueza completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vvkAOvzIPNU",
                "durationSeconds": 1839,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Meu Dom da Riqueza completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/t3WIWzuTAxg",
                "durationSeconds": 825,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Meu Dom da Riqueza completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MtSKQc54ADc",
                "durationSeconds": 1172,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Meu Dom da Riqueza completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gOeTuKeVtTY",
                "durationSeconds": 2093,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-papai-campeao-esua-filha-da-sorte",
        "title": "Papai Campeão esua Filha da Sorte",
        "slug": "papai-campeao-esua-filha-da-sorte",
        "synopsis": "Acompanhe a emocionante história de Papai Campeão esua Filha da Sorte, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/7usOmQ-gsbY/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/7usOmQ-gsbY/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 8,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 11484,
        "likesCount": 4019,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Papai Campeão esua Filha da Sorte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7usOmQ-gsbY",
                "durationSeconds": 773,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Papai Campeão esua Filha da Sorte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tQoRJ--0HdY",
                "durationSeconds": 779,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Papai Campeão esua Filha da Sorte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rmd9HeDGg-A",
                "durationSeconds": 736,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Papai Campeão esua Filha da Sorte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/J__0WLoxNYM",
                "durationSeconds": 852,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Papai Campeão esua Filha da Sorte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/u-4rrSwm9UE",
                "durationSeconds": 787,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Papai Campeão esua Filha da Sorte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bXzwQwJf7FQ",
                "durationSeconds": 761,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Papai Campeão esua Filha da Sorte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HAScXgbsd1I",
                "durationSeconds": 442,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Papai Campeão esua Filha da Sorte completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bdtaV_HLH2U",
                "durationSeconds": 719,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-recuperando-nossa-melodia",
        "title": "Recuperando Nossa Melodia",
        "slug": "recuperando-nossa-melodia",
        "synopsis": "Acompanhe a emocionante história de Recuperando Nossa Melodia, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/9NemnDAxdAA/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/9NemnDAxdAA/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 28621,
        "likesCount": 10017,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Recuperando Nossa Melodia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9NemnDAxdAA",
                "durationSeconds": 816,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Recuperando Nossa Melodia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qr56NNe8XZE",
                "durationSeconds": 885,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Recuperando Nossa Melodia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/C3gMLrWA8g8",
                "durationSeconds": 1096,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Recuperando Nossa Melodia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/baITob8tI_E",
                "durationSeconds": 932,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Recuperando Nossa Melodia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JrAeHz4WPKs",
                "durationSeconds": 1053,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Recuperando Nossa Melodia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YNzCSiHuoZk",
                "durationSeconds": 918,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Recuperando Nossa Melodia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JADMHfq8IW8",
                "durationSeconds": 855,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Recuperando Nossa Melodia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xgw0fUedLXY",
                "durationSeconds": 910,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Recuperando Nossa Melodia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rUqvXoVDvKA",
                "durationSeconds": 953,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Recuperando Nossa Melodia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uFVVhoSGgO8",
                "durationSeconds": 972,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-curador-milagroso",
        "title": "O Curador Milagroso",
        "slug": "o-curador-milagroso",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em O Curador Milagroso.",
        "coverUrl": "https://img.youtube.com/vi/SGDuXnxojRg/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/SGDuXnxojRg/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 6,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33227,
        "likesCount": 11629,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Curador Milagroso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SGDuXnxojRg",
                "durationSeconds": 732,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Curador Milagroso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/npjtcnf8_Kg",
                "durationSeconds": 644,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Curador Milagroso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2mkhBn_5fno",
                "durationSeconds": 1110,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Curador Milagroso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/H8g-zbilZNE",
                "durationSeconds": 1137,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Curador Milagroso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ARv9iYMPIRk",
                "durationSeconds": 649,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Curador Milagroso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cOlTcpA1zMo",
                "durationSeconds": 603,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-de-zombado-a-imparavel",
        "title": "De Zombado a Imparável",
        "slug": "de-zombado-a-imparavel",
        "synopsis": "Acompanhe a emocionante história de De Zombado a Imparável, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/6-0a1Gx2AKA/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/6-0a1Gx2AKA/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 15099,
        "likesCount": 5284,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de De Zombado a Imparável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6-0a1Gx2AKA",
                "durationSeconds": 1046,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de De Zombado a Imparável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WOm8djT_h8A",
                "durationSeconds": 846,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de De Zombado a Imparável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zEN3hlqblzA",
                "durationSeconds": 1083,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de De Zombado a Imparável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vWQLqDSVDyo",
                "durationSeconds": 1046,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-amanha-sera-minha-vez",
        "title": "Amanhã Será Minha Vez",
        "slug": "amanha-sera-minha-vez",
        "synopsis": "Acompanhe a emocionante história de Amanhã Será Minha Vez, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/qFTyLLjlhQM/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/qFTyLLjlhQM/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 26096,
        "likesCount": 9133,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Amanhã Será Minha Vez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qFTyLLjlhQM",
                "durationSeconds": 915,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-o-retorno-da-sombra",
        "title": "O Retorno da Sombra",
        "slug": "o-retorno-da-sombra",
        "synopsis": "Humilhado no passado, o retorno triunfal para cobrar cada dívida e proteger quem ama abala as estruturas de todos os traidores em O Retorno da Sombra.",
        "coverUrl": "https://img.youtube.com/vi/WT7EdbcE-lE/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/WT7EdbcE-lE/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,vinganca,poder,romance,drama",
        "totalEpisodes": 6,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34113,
        "likesCount": 11939,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Retorno da Sombra completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WT7EdbcE-lE",
                "durationSeconds": 1315,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Retorno da Sombra completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/88zpYzog_qs",
                "durationSeconds": 964,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Retorno da Sombra completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/v__W-tY7Rv4",
                "durationSeconds": 1293,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Retorno da Sombra completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RpTr3bWI3H0",
                "durationSeconds": 1201,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Retorno da Sombra completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fAFJudkhgcg",
                "durationSeconds": 964,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Retorno da Sombra completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/t2BfC4wIKVo",
                "durationSeconds": 1329,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-meu-bilionarioimplacavel",
        "title": "Meu BilionárioImplacável",
        "slug": "meu-bilionarioimplacavel",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em Meu BilionárioImplacável.",
        "coverUrl": "https://img.youtube.com/vi/kfmMZjA1Tq0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/kfmMZjA1Tq0/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 18,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 18582,
        "likesCount": 6503,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kfmMZjA1Tq0",
                "durationSeconds": 1497,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jFaCgPO_LXE",
                "durationSeconds": 1522,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7P0awVyH-9Y",
                "durationSeconds": 1510,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fk0aHyNkr3s",
                "durationSeconds": 1072,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2uXWGIaLaWU",
                "durationSeconds": 949,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/21LlGPMsGrc",
                "durationSeconds": 1328,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lQpvIupewgI",
                "durationSeconds": 191,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LgjpxVhhAzw",
                "durationSeconds": 1323,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/B18q9nyk-sY",
                "durationSeconds": 1030,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0dQIv7S1fp4",
                "durationSeconds": 1447,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5DN1Cmkd7hY",
                "durationSeconds": 186,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JfrJergAUTI",
                "durationSeconds": 1354,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IMAbDUfBkVU",
                "durationSeconds": 1328,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uxRSLvia3bw",
                "durationSeconds": 1103,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zZ41JBW0-UM",
                "durationSeconds": 1035,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YzUt-AU5AK0",
                "durationSeconds": 191,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BYs3juof7Rg",
                "durationSeconds": 1371,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Meu BilionárioImplacável completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qhalrn4qZLo",
                "durationSeconds": 1323,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-tutora-e-o-rebelde",
        "title": "A Tutora e o Rebelde",
        "slug": "a-tutora-e-o-rebelde",
        "synopsis": "Acompanhe a emocionante história de A Tutora e o Rebelde, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/3_WZbiGf5E0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/3_WZbiGf5E0/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 16,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 23218,
        "likesCount": 8126,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3_WZbiGf5E0",
                "durationSeconds": 997,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_d0GaFHz2v4",
                "durationSeconds": 997,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LPrwEEcfX4U",
                "durationSeconds": 357,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tECGdRguQ2w",
                "durationSeconds": 1067,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lkPlEC6I6MQ",
                "durationSeconds": 911,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hrQWXQqBWgg",
                "durationSeconds": 858,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RoId0hgMb78",
                "durationSeconds": 679,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0j2mPOw05wM",
                "durationSeconds": 831,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/swK7RrYeAI4",
                "durationSeconds": 490,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/q4kZqrH4BUo",
                "durationSeconds": 779,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Kc3hQjnzNTE",
                "durationSeconds": 353,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HYHXzDOBFPA",
                "durationSeconds": 1020,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ULqed5NLoRg",
                "durationSeconds": 692,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Z_1dA1qIoX4",
                "durationSeconds": 597,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Y56gKp0yU9g",
                "durationSeconds": 377,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de A Tutora e o Rebelde completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/TDPdsexL-9o",
                "durationSeconds": 932,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-meu-noivo-foi-casei-com-outro",
        "title": "Meu Noivo Foi, Casei com Outro",
        "slug": "meu-noivo-foi-casei-com-outro",
        "synopsis": "Acompanhe a emocionante história de Meu Noivo Foi, Casei com Outro, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/wFMS5xhSYk0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/wFMS5xhSYk0/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34487,
        "likesCount": 12070,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Meu Noivo Foi, Casei com Outro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wFMS5xhSYk0",
                "durationSeconds": 228,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Meu Noivo Foi, Casei com Outro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lw8gi7tlTkQ",
                "durationSeconds": 1398,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Meu Noivo Foi, Casei com Outro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YtXRLv-fMvw",
                "durationSeconds": 964,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Meu Noivo Foi, Casei com Outro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HkNtyQt8sqk",
                "durationSeconds": 929,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Meu Noivo Foi, Casei com Outro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/a1UqmPQEuxg",
                "durationSeconds": 569,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Meu Noivo Foi, Casei com Outro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/T3rsMiHIQ68",
                "durationSeconds": 556,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Meu Noivo Foi, Casei com Outro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/aQ74jr-Mna4",
                "durationSeconds": 855,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Meu Noivo Foi, Casei com Outro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/C_IOZiMnzlc",
                "durationSeconds": 309,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Meu Noivo Foi, Casei com Outro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jTXI9XjVBpU",
                "durationSeconds": 845,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-lado-oculto-do-marido",
        "title": "O Lado Oculto do Marido",
        "slug": "o-lado-oculto-do-marido",
        "synopsis": "Acompanhe a emocionante história de O Lado Oculto do Marido, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/PBtMjSOxh7s/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/PBtMjSOxh7s/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 7,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 21863,
        "likesCount": 7652,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Lado Oculto do Marido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PBtMjSOxh7s",
                "durationSeconds": 1180,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Lado Oculto do Marido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/akEHj341YPg",
                "durationSeconds": 195,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Lado Oculto do Marido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/j9uEPooBgQM",
                "durationSeconds": 523,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Lado Oculto do Marido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/f6_5bdwj42s",
                "durationSeconds": 195,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Lado Oculto do Marido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VcSEIOankgo",
                "durationSeconds": 1230,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Lado Oculto do Marido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mZ92bL84JPE",
                "durationSeconds": 1183,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Lado Oculto do Marido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BgFNsMss9u0",
                "durationSeconds": 523,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-sacrificio-decenal-ventre-do-herdeiro",
        "title": "Sacrifício Decenal, Ventre do Herdeiro",
        "slug": "sacrificio-decenal-ventre-do-herdeiro",
        "synopsis": "Acompanhe a emocionante história de Sacrifício Decenal, Ventre do Herdeiro, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/SR7YpKQOH38/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/SR7YpKQOH38/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 20046,
        "likesCount": 7016,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Sacrifício Decenal, Ventre do Herdeiro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SR7YpKQOH38",
                "durationSeconds": 695,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Sacrifício Decenal, Ventre do Herdeiro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/10cOUa4cV2c",
                "durationSeconds": 370,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Sacrifício Decenal, Ventre do Herdeiro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_piqNFvPaOM",
                "durationSeconds": 734,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Sacrifício Decenal, Ventre do Herdeiro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/iPSZqBAX5n8",
                "durationSeconds": 349,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Sacrifício Decenal, Ventre do Herdeiro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5dc6MFoBht0",
                "durationSeconds": 682,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Sacrifício Decenal, Ventre do Herdeiro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OaXEvpFh678",
                "durationSeconds": 224,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Sacrifício Decenal, Ventre do Herdeiro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PvCQ1-1m09Y",
                "durationSeconds": 691,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Sacrifício Decenal, Ventre do Herdeiro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cQzjoM9BzbY",
                "durationSeconds": 321,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Sacrifício Decenal, Ventre do Herdeiro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/TIzDlqaa5bM",
                "durationSeconds": 815,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Sacrifício Decenal, Ventre do Herdeiro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/T9gTgDlXkDM",
                "durationSeconds": 356,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-zeladora-do-gelo-13-anos-depois",
        "title": "A Zeladora do Gelo (13 Anos Depois)",
        "slug": "a-zeladora-do-gelo-13-anos-depois",
        "synopsis": "Acompanhe a emocionante história de A Zeladora do Gelo (13 Anos Depois), com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/Ne_3MIutPoY/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Ne_3MIutPoY/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 18,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34341,
        "likesCount": 12019,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ne_3MIutPoY",
                "durationSeconds": 395,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EDa_qlOCW7A",
                "durationSeconds": 1235,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xViGRVXwyRM",
                "durationSeconds": 393,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ogekzx-DjG8",
                "durationSeconds": 1235,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/g7lIfFGhJPA",
                "durationSeconds": 1320,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/h7FqDzzpHaE",
                "durationSeconds": 1895,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Gr1rbYIgOGE",
                "durationSeconds": 1138,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/pFH0qXhRXXQ",
                "durationSeconds": 1236,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/M4pWVj-W5tY",
                "durationSeconds": 1246,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/yfa4MTYTwEQ",
                "durationSeconds": 244,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XQEg9sMFJQM",
                "durationSeconds": 1697,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hZorrexK7R8",
                "durationSeconds": 395,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GbUMT_hL9M8",
                "durationSeconds": 1753,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/M_SkRlvKgTQ",
                "durationSeconds": 1218,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uORdEUk8OVU",
                "durationSeconds": 541,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YeVxxdZKRS0",
                "durationSeconds": 842,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DSq6zcixmtw",
                "durationSeconds": 1235,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de A Zeladora do Gelo (13 Anos Depois) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/neaanDYyrZg",
                "durationSeconds": 1797,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-principe-e-o-sangue-real-do-filho",
        "title": "O Príncipe e o Sangue Real do Filho",
        "slug": "o-principe-e-o-sangue-real-do-filho",
        "synopsis": "Acompanhe a emocionante história de O Príncipe e o Sangue Real do Filho, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/rEuychkoU8c/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/rEuychkoU8c/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 7,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 24877,
        "likesCount": 8706,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Príncipe e o Sangue Real do Filho completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rEuychkoU8c",
                "durationSeconds": 1816,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Príncipe e o Sangue Real do Filho completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/iDJGR205fgA",
                "durationSeconds": 683,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Príncipe e o Sangue Real do Filho completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eR4rS6A1dCQ",
                "durationSeconds": 220,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Príncipe e o Sangue Real do Filho completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9ZdkwsYiuw4",
                "durationSeconds": 220,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Príncipe e o Sangue Real do Filho completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kDaYYIrfDow",
                "durationSeconds": 220,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Príncipe e o Sangue Real do Filho completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gxPI7G4FSpM",
                "durationSeconds": 1281,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Príncipe e o Sangue Real do Filho completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Or-vUeXmn_U",
                "durationSeconds": 215,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-ascensao-do-pequeno-mestre",
        "title": "Ascensão do Pequeno Mestre",
        "slug": "ascensao-do-pequeno-mestre",
        "synopsis": "Acompanhe a emocionante história de Ascensão do Pequeno Mestre, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/cGsnblGs0DI/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/cGsnblGs0DI/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 16643,
        "likesCount": 5825,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Ascensão do Pequeno Mestre completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cGsnblGs0DI",
                "durationSeconds": 286,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Ascensão do Pequeno Mestre completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/f7SuvBFapmc",
                "durationSeconds": 584,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Ascensão do Pequeno Mestre completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qiLqKk-owWk",
                "durationSeconds": 331,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Ascensão do Pequeno Mestre completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DP2F911cqSI",
                "durationSeconds": 453,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-virgem-do-volei-de-praia",
        "title": "Virgem do Vôlei de Praia",
        "slug": "virgem-do-volei-de-praia",
        "synopsis": "Acompanhe a emocionante história de Virgem do Vôlei de Praia, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/eXjjOwWHCwU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/eXjjOwWHCwU/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33677,
        "likesCount": 11786,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Virgem do Vôlei de Praia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eXjjOwWHCwU",
                "durationSeconds": 849,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Virgem do Vôlei de Praia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dO3Qye35Ij4",
                "durationSeconds": 327,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Virgem do Vôlei de Praia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GZP3p_C6phM",
                "durationSeconds": 584,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Virgem do Vôlei de Praia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bUW5-fY4VOk",
                "durationSeconds": 584,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Virgem do Vôlei de Praia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PCmC8RBV4dI",
                "durationSeconds": 584,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Virgem do Vôlei de Praia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QBxv53Z8D_g",
                "durationSeconds": 849,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Virgem do Vôlei de Praia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4lhV97Cl26U",
                "durationSeconds": 400,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Virgem do Vôlei de Praia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XC9AzrWsrLs",
                "durationSeconds": 729,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Virgem do Vôlei de Praia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SNW_36YbwAY",
                "durationSeconds": 620,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Virgem do Vôlei de Praia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_VRVaoZ_CY8",
                "durationSeconds": 937,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-adeus-meus-irmaos",
        "title": "Adeus, Meus Irmãos",
        "slug": "adeus-meus-irmaos",
        "synopsis": "Acompanhe a emocionante história de Adeus, Meus Irmãos, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/eLHY_i4QFM4/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/eLHY_i4QFM4/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 18,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 27562,
        "likesCount": 9646,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eLHY_i4QFM4",
                "durationSeconds": 1480,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nWQIaKHrvN4",
                "durationSeconds": 740,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6zalJzqkG00",
                "durationSeconds": 1826,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_hcmX14NDZ8",
                "durationSeconds": 1642,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/w0LZDeN8ldY",
                "durationSeconds": 1952,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Yt-7Ij1g6Ic",
                "durationSeconds": 562,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/skjDDb31U0A",
                "durationSeconds": 982,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JaY11aKGRcM",
                "durationSeconds": 453,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IMtB5Tb_MZw",
                "durationSeconds": 1332,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hU84Y3eBQT4",
                "durationSeconds": 1816,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wCfLuMW3qnc",
                "durationSeconds": 1237,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kOsplt7PNgg",
                "durationSeconds": 566,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mRMdfh3mlE0",
                "durationSeconds": 1710,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/E8kPWb3J4gI",
                "durationSeconds": 1990,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LGmlj88_zzg",
                "durationSeconds": 1763,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ynydMsbbqUo",
                "durationSeconds": 1991,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/p9YgJrr0fqM",
                "durationSeconds": 1826,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Adeus, Meus Irmãos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/yEL5Knap5aU",
                "durationSeconds": 2139,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-magnata-secreto-amor-revelado",
        "title": "Magnata Secreto Amor Revelado",
        "slug": "magnata-secreto-amor-revelado",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em Magnata Secreto Amor Revelado.",
        "coverUrl": "https://img.youtube.com/vi/RDju7xmaPp4/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/RDju7xmaPp4/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 13077,
        "likesCount": 4576,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Magnata Secreto Amor Revelado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RDju7xmaPp4",
                "durationSeconds": 644,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-acao-de-gracas-em-familia",
        "title": "Ação de Graças em Família",
        "slug": "acao-de-gracas-em-familia",
        "synopsis": "Acompanhe a emocionante história de Ação de Graças em Família, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/aagB7L5z6fM/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/aagB7L5z6fM/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32509,
        "likesCount": 11378,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Ação de Graças em Família completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/aagB7L5z6fM",
                "durationSeconds": 1196,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Ação de Graças em Família completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JJtxP3HSmT0",
                "durationSeconds": 512,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Ação de Graças em Família completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/esNQqRSrzAI",
                "durationSeconds": 248,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Ação de Graças em Família completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QjTnz6huDSs",
                "durationSeconds": 823,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Ação de Graças em Família completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5JU6p2qeMdk",
                "durationSeconds": 429,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Ação de Graças em Família completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/84QgDzKNT4o",
                "durationSeconds": 1398,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Ação de Graças em Família completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qH8gMwqrr1w",
                "durationSeconds": 509,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Ação de Graças em Família completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/A-CioPjPPo8",
                "durationSeconds": 1007,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Ação de Graças em Família completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Dw06d8sSbFc",
                "durationSeconds": 1040,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-preco-do-seu-adeus",
        "title": "O Preço do Seu Adeus",
        "slug": "o-preco-do-seu-adeus",
        "synopsis": "Acompanhe a emocionante história de O Preço do Seu Adeus, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/KlIYdNZnMNQ/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/KlIYdNZnMNQ/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 29867,
        "likesCount": 10453,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Preço do Seu Adeus completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/KlIYdNZnMNQ",
                "durationSeconds": 1469,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-doutora-me-deixe-ser-seu",
        "title": "Doutora, Me Deixe Ser Seu",
        "slug": "doutora-me-deixe-ser-seu",
        "synopsis": "Acompanhe a emocionante história de Doutora, Me Deixe Ser Seu, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/6G_Vcvyhc6c/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/6G_Vcvyhc6c/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 15,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 9420,
        "likesCount": 3297,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6G_Vcvyhc6c",
                "durationSeconds": 1309,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JN2cqVREHTU",
                "durationSeconds": 1099,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vaD8MMxHlgU",
                "durationSeconds": 1269,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LwPtaPoIvv8",
                "durationSeconds": 1102,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CCCuV69FFbw",
                "durationSeconds": 895,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Pu0k-GmRQIM",
                "durationSeconds": 789,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zhlfsDehyPw",
                "durationSeconds": 345,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0-5n7AVKwMQ",
                "durationSeconds": 1099,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3d1p_WH3TBM",
                "durationSeconds": 1155,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XOMilqkSViw",
                "durationSeconds": 1144,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uYVHLYFhJyM",
                "durationSeconds": 1232,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZlBrUGAxp_g",
                "durationSeconds": 1167,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GNe7gBVjLg0",
                "durationSeconds": 1265,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Pp8Wp3uT3qM",
                "durationSeconds": 1268,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Doutora, Me Deixe Ser Seu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9--R-JbKSCs",
                "durationSeconds": 1129,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-bilionario-que-fingia-ser-pobre-nate",
        "title": "O Bilionário que Fingia Ser Pobre (Nate)",
        "slug": "o-bilionario-que-fingia-ser-pobre-nate",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em O Bilionário que Fingia Ser Pobre (Nate).",
        "coverUrl": "https://img.youtube.com/vi/1zYaEksB0mk/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/1zYaEksB0mk/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 30861,
        "likesCount": 10801,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Bilionário que Fingia Ser Pobre (Nate) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1zYaEksB0mk",
                "durationSeconds": 1128,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Bilionário que Fingia Ser Pobre (Nate) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZdoK_LB7rAY",
                "durationSeconds": 1090,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Bilionário que Fingia Ser Pobre (Nate) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EZmz82MrK78",
                "durationSeconds": 1128,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Bilionário que Fingia Ser Pobre (Nate) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dWdJETi0ke0",
                "durationSeconds": 356,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Bilionário que Fingia Ser Pobre (Nate) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AaghuaNVQcg",
                "durationSeconds": 1128,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Bilionário que Fingia Ser Pobre (Nate) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9QCoWsQKhMo",
                "durationSeconds": 660,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Bilionário que Fingia Ser Pobre (Nate) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/e8px9haUdpw",
                "durationSeconds": 782,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de O Bilionário que Fingia Ser Pobre (Nate) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5KNBVHSUmAQ",
                "durationSeconds": 315,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de O Bilionário que Fingia Ser Pobre (Nate) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vHyls5YRdaU",
                "durationSeconds": 315,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-fantasma-de-vegas",
        "title": "O Fantasma de Vegas",
        "slug": "o-fantasma-de-vegas",
        "synopsis": "Acompanhe a emocionante história de O Fantasma de Vegas, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/n-D89ibPP98/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/n-D89ibPP98/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31743,
        "likesCount": 11110,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Fantasma de Vegas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/n-D89ibPP98",
                "durationSeconds": 1823,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Fantasma de Vegas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WkxPsreKHvM",
                "durationSeconds": 322,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Fantasma de Vegas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/C9YjBSg9MaI",
                "durationSeconds": 665,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Fantasma de Vegas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-2sJmTX4bIY",
                "durationSeconds": 665,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-do-nada-ao-heroi-marido-com-supervisao",
        "title": "Do Nada ao Herói: Marido com Supervisão",
        "slug": "do-nada-ao-heroi-marido-com-supervisao",
        "synopsis": "Acompanhe a emocionante história de Do Nada ao Herói: Marido com Supervisão, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/v81cJc8IVy8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/v81cJc8IVy8/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 15,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 11255,
        "likesCount": 3939,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/v81cJc8IVy8",
                "durationSeconds": 1755,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LoK6fTZPzeU",
                "durationSeconds": 801,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/spIRmxPiRtM",
                "durationSeconds": 328,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tAjhzy0EyXM",
                "durationSeconds": 563,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JgyTHuDwmm0",
                "durationSeconds": 1032,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nzX7__XysPs",
                "durationSeconds": 328,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DbUeqjzDERY",
                "durationSeconds": 1810,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZRRSauuyD0c",
                "durationSeconds": 1806,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BOdQ_AyHya8",
                "durationSeconds": 1238,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/oZGXJXgi-so",
                "durationSeconds": 1955,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gmps7jcw0fQ",
                "durationSeconds": 1692,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WpUb3KcVzpI",
                "durationSeconds": 1800,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/s8R147VWxdU",
                "durationSeconds": 682,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gMsii3t8g6M",
                "durationSeconds": 1800,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Do Nada ao Herói: Marido com Supervisão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EkLDWZ8Xeng",
                "durationSeconds": 723,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-traicao-do-beneficiado",
        "title": "Traição do Beneficiado",
        "slug": "traicao-do-beneficiado",
        "synopsis": "Acompanhe a emocionante história de Traição do Beneficiado, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/zdbq9OOFqtU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/zdbq9OOFqtU/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 28766,
        "likesCount": 10068,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Traição do Beneficiado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zdbq9OOFqtU",
                "durationSeconds": 296,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Traição do Beneficiado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4YgeDFv3cXg",
                "durationSeconds": 355,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Traição do Beneficiado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZrGeaS_94lQ",
                "durationSeconds": 225,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Traição do Beneficiado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FFWynHm8ekQ",
                "durationSeconds": 1354,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-herdeira-retoma-seu-trono",
        "title": "Herdeira Retoma Seu Trono",
        "slug": "herdeira-retoma-seu-trono",
        "synopsis": "Acompanhe a emocionante história de Herdeira Retoma Seu Trono, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/2Zl5Ff_z_r0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/2Zl5Ff_z_r0/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33155,
        "likesCount": 11604,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Herdeira Retoma Seu Trono completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2Zl5Ff_z_r0",
                "durationSeconds": 986,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Herdeira Retoma Seu Trono completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1ZWoOrS97-E",
                "durationSeconds": 665,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Herdeira Retoma Seu Trono completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Uir9hommvqU",
                "durationSeconds": 711,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Herdeira Retoma Seu Trono completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lhmaG78Vs1A",
                "durationSeconds": 1565,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Herdeira Retoma Seu Trono completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IZfAjnI8Y-I",
                "durationSeconds": 675,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-meu-amante-secreto-e-filho-da-minha-melhor-amiga",
        "title": "Meu Amante Secreto é Filho da Minha Melhor Amiga",
        "slug": "meu-amante-secreto-e-filho-da-minha-melhor-amiga",
        "synopsis": "Acompanhe a emocionante história de Meu Amante Secreto é Filho da Minha Melhor Amiga, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/Sutv3Cg6Lik/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Sutv3Cg6Lik/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 14876,
        "likesCount": 5206,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Meu Amante Secreto é Filho da Minha Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Sutv3Cg6Lik",
                "durationSeconds": 547,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Meu Amante Secreto é Filho da Minha Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/egTc6oiIFvM",
                "durationSeconds": 777,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Meu Amante Secreto é Filho da Minha Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-S10371qgFI",
                "durationSeconds": 323,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Meu Amante Secreto é Filho da Minha Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GlJCN3eFrIg",
                "durationSeconds": 501,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Meu Amante Secreto é Filho da Minha Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QoynjzeYq0E",
                "durationSeconds": 500,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Meu Amante Secreto é Filho da Minha Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OcfpBe8Lmhk",
                "durationSeconds": 552,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Meu Amante Secreto é Filho da Minha Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/txnWczv3qXo",
                "durationSeconds": 521,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Meu Amante Secreto é Filho da Minha Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SkMBmxORK4U",
                "durationSeconds": 507,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Meu Amante Secreto é Filho da Minha Melhor Amiga completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SHTK1QtsBms",
                "durationSeconds": 369,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-familia-perfeita-da-garota-planta",
        "title": "A Família Perfeita da Garota Planta",
        "slug": "a-familia-perfeita-da-garota-planta",
        "synopsis": "Acompanhe a emocionante história de A Família Perfeita da Garota Planta, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/nXYuJ0dDvNs/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/nXYuJ0dDvNs/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 26264,
        "likesCount": 9192,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Família Perfeita da Garota Planta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nXYuJ0dDvNs",
                "durationSeconds": 1492,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Família Perfeita da Garota Planta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-tv3NEA20bM",
                "durationSeconds": 255,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Família Perfeita da Garota Planta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hmbvb01tdic",
                "durationSeconds": 1134,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Família Perfeita da Garota Planta completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/A-osQJV7rJ4",
                "durationSeconds": 1308,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-amor-cego-da-herdeira",
        "title": "Amor Cego da Herdeira",
        "slug": "amor-cego-da-herdeira",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Amor Cego da Herdeira.",
        "coverUrl": "https://img.youtube.com/vi/GgwWrj6DyuU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/GgwWrj6DyuU/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 13,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34073,
        "likesCount": 11925,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GgwWrj6DyuU",
                "durationSeconds": 726,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_LjpxbLqOnY",
                "durationSeconds": 397,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/C8yLRugolfI",
                "durationSeconds": 730,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MZaQZpxmqHQ",
                "durationSeconds": 666,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RTMabr0_Bts",
                "durationSeconds": 868,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OTnJsAZHPYk",
                "durationSeconds": 667,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QmXBAWJUzdc",
                "durationSeconds": 765,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/stgzyLB-gMk",
                "durationSeconds": 221,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZXwKi0zGS7A",
                "durationSeconds": 530,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VKOq0aVxpbE",
                "durationSeconds": 315,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zdmZ-0Y83B4",
                "durationSeconds": 473,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ybxd9zGjcm4",
                "durationSeconds": 710,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Amor Cego da Herdeira completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4dBeAU7D1GE",
                "durationSeconds": 702,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-5-anos-sendo-o-escudo-ava-e-dante",
        "title": "5 Anos Sendo o Escudo (Ava e Dante)",
        "slug": "5-anos-sendo-o-escudo-ava-e-dante",
        "synopsis": "Acompanhe a emocionante história de 5 Anos Sendo o Escudo (Ava e Dante), com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/Avieaf-_9JY/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Avieaf-_9JY/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 11,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 18369,
        "likesCount": 6429,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de 5 Anos Sendo o Escudo (Ava e Dante) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Avieaf-_9JY",
                "durationSeconds": 2084,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de 5 Anos Sendo o Escudo (Ava e Dante) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZKYydJK4IpM",
                "durationSeconds": 2000,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de 5 Anos Sendo o Escudo (Ava e Dante) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LMatNT97HMo",
                "durationSeconds": 2109,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de 5 Anos Sendo o Escudo (Ava e Dante) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nq-ypgv5aaM",
                "durationSeconds": 365,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de 5 Anos Sendo o Escudo (Ava e Dante) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wtXlylyYVlk",
                "durationSeconds": 680,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de 5 Anos Sendo o Escudo (Ava e Dante) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/InHJz40TeV0",
                "durationSeconds": 781,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de 5 Anos Sendo o Escudo (Ava e Dante) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NBxDSXuBnaU",
                "durationSeconds": 2164,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de 5 Anos Sendo o Escudo (Ava e Dante) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fPh27kAMjbM",
                "durationSeconds": 784,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de 5 Anos Sendo o Escudo (Ava e Dante) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EEqW6sfspqM",
                "durationSeconds": 456,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de 5 Anos Sendo o Escudo (Ava e Dante) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8csgGzMCjh0",
                "durationSeconds": 447,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de 5 Anos Sendo o Escudo (Ava e Dante) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CyLSPrwWmxI",
                "durationSeconds": 2084,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-do-amor-a-solidao",
        "title": "Do Amor à Solidão",
        "slug": "do-amor-a-solidao",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Do Amor à Solidão.",
        "coverUrl": "https://img.youtube.com/vi/f17spziGzlA/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/f17spziGzlA/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 23407,
        "likesCount": 8192,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Do Amor à Solidão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/f17spziGzlA",
                "durationSeconds": 685,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Do Amor à Solidão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wlbxeybqXsE",
                "durationSeconds": 1550,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Do Amor à Solidão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gf_jeEAgUlA",
                "durationSeconds": 678,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Do Amor à Solidão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ldpi5vKZDi8",
                "durationSeconds": 685,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Do Amor à Solidão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SFrwDe9BMew",
                "durationSeconds": 851,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Do Amor à Solidão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RmiyJuHnRrk",
                "durationSeconds": 657,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Do Amor à Solidão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-lmK8FCFJgY",
                "durationSeconds": 706,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Do Amor à Solidão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BO77J_cY-qg",
                "durationSeconds": 686,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Do Amor à Solidão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4EVRvQsQxH4",
                "durationSeconds": 662,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Do Amor à Solidão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6J7IUXSSoOI",
                "durationSeconds": 1368,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-amor-apos-as-grades",
        "title": "Amor Após as Grades",
        "slug": "amor-apos-as-grades",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Amor Após as Grades.",
        "coverUrl": "https://img.youtube.com/vi/lLpaTzfKii8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/lLpaTzfKii8/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34479,
        "likesCount": 12067,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Amor Após as Grades completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lLpaTzfKii8",
                "durationSeconds": 589,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Amor Após as Grades completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/pCVQmDu3i9U",
                "durationSeconds": 1506,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Amor Após as Grades completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/E4ezPgTSBXI",
                "durationSeconds": 1169,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Amor Após as Grades completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gRHq3pgybWU",
                "durationSeconds": 1268,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Amor Após as Grades completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/poC19OobvJg",
                "durationSeconds": 1520,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-namorado-de-mentira-cura-de-verdade",
        "title": "Namorado de Mentira Cura de Verdade",
        "slug": "namorado-de-mentira-cura-de-verdade",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Namorado de Mentira Cura de Verdade.",
        "coverUrl": "https://img.youtube.com/vi/Qof1jEnZ9fs/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Qof1jEnZ9fs/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 21665,
        "likesCount": 7582,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Namorado de Mentira Cura de Verdade completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Qof1jEnZ9fs",
                "durationSeconds": 1226,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Namorado de Mentira Cura de Verdade completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-pib484GV_Y",
                "durationSeconds": 1534,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Namorado de Mentira Cura de Verdade completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1sXM33A7R-o",
                "durationSeconds": 1551,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Namorado de Mentira Cura de Verdade completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rXlVOM41ZMA",
                "durationSeconds": 614,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Namorado de Mentira Cura de Verdade completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ztNFO13rWKY",
                "durationSeconds": 1531,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Namorado de Mentira Cura de Verdade completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gWCecQ5-myw",
                "durationSeconds": 1084,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Namorado de Mentira Cura de Verdade completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Fy3WPhv9zC8",
                "durationSeconds": 1325,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Namorado de Mentira Cura de Verdade completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DUJQrWiwuBo",
                "durationSeconds": 1026,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Namorado de Mentira Cura de Verdade completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1QGWHxnFHBM",
                "durationSeconds": 1311,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Namorado de Mentira Cura de Verdade completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MuBGguccLT8",
                "durationSeconds": 1240,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-lacos-perigosos",
        "title": "Laços Perigosos",
        "slug": "lacos-perigosos",
        "synopsis": "Acompanhe a emocionante história de Laços Perigosos, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/cJehWG-Bfb0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/cJehWG-Bfb0/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 20252,
        "likesCount": 7088,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Laços Perigosos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cJehWG-Bfb0",
                "durationSeconds": 770,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Laços Perigosos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/TKlz47Ud-g8",
                "durationSeconds": 1197,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Laços Perigosos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8LdDcMMax0M",
                "durationSeconds": 1016,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Laços Perigosos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/v13--KubN_M",
                "durationSeconds": 891,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Laços Perigosos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/F_yOAise0ak",
                "durationSeconds": 1013,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Laços Perigosos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hKS-_eIMRr8",
                "durationSeconds": 1059,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Laços Perigosos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/H3cSi4Ql0sk",
                "durationSeconds": 1016,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Laços Perigosos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6Q1WE_WzXtI",
                "durationSeconds": 559,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Laços Perigosos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LINk0FJ3ttw",
                "durationSeconds": 901,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Laços Perigosos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xPtv3Q5Vhzw",
                "durationSeconds": 1036,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-7-dias-de-noivado-falso",
        "title": "7 Dias de Noivado Falso",
        "slug": "7-dias-de-noivado-falso",
        "synopsis": "Um matrimônio selado por conveniência e obrigações familiares esconde sentimentos intensos e segredos proibidos em 7 Dias de Noivado Falso.",
        "coverUrl": "https://img.youtube.com/vi/J8wKSVcnKp8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/J8wKSVcnKp8/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,casamento-arranjado,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34365,
        "likesCount": 12027,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de 7 Dias de Noivado Falso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/J8wKSVcnKp8",
                "durationSeconds": 220,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de 7 Dias de Noivado Falso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ser4LQDG7Dk",
                "durationSeconds": 808,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de 7 Dias de Noivado Falso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VXu4UMSiJb0",
                "durationSeconds": 904,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-rainha-alfa-das-49-matilhas",
        "title": "A Rainha Alfa das 49 Matilhas",
        "slug": "a-rainha-alfa-das-49-matilhas",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em A Rainha Alfa das 49 Matilhas.",
        "coverUrl": "https://img.youtube.com/vi/bwCMkKyA8jo/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/bwCMkKyA8jo/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 13,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 24697,
        "likesCount": 8643,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bwCMkKyA8jo",
                "durationSeconds": 2073,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/prMirBJbo34",
                "durationSeconds": 2151,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mYKgsO3Dt-8",
                "durationSeconds": 779,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/T5AFk_cGKAE",
                "durationSeconds": 779,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RQmoMIovTdA",
                "durationSeconds": 824,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/v0PfoM52ITk",
                "durationSeconds": 1721,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/pRBwg4k7L5k",
                "durationSeconds": 1310,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BNnKTw9WNkI",
                "durationSeconds": 779,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fLTgp-rmMNw",
                "durationSeconds": 1179,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ceQ7ZsT6XXI",
                "durationSeconds": 1625,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/w0fWzI8rcmE",
                "durationSeconds": 1939,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/F39ZuRj4sMM",
                "durationSeconds": 1179,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de A Rainha Alfa das 49 Matilhas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EQusTeN2lZI",
                "durationSeconds": 1590,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-casal-de-poder-supremo",
        "title": "Casal de Poder Supremo",
        "slug": "casal-de-poder-supremo",
        "synopsis": "Acompanhe a emocionante história de Casal de Poder Supremo, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/dscb7VqeE8M/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/dscb7VqeE8M/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 16862,
        "likesCount": 5901,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Casal de Poder Supremo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dscb7VqeE8M",
                "durationSeconds": 1319,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Casal de Poder Supremo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ISaKmfE-i80",
                "durationSeconds": 1022,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Casal de Poder Supremo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DJmokS36e4A",
                "durationSeconds": 1205,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Casal de Poder Supremo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eU3_WRZiyYM",
                "durationSeconds": 1086,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Casal de Poder Supremo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/de53XacjgUo",
                "durationSeconds": 1224,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-ele-nao-conhece-misericordia",
        "title": "Ele Não Conhece Misericórdia",
        "slug": "ele-nao-conhece-misericordia",
        "synopsis": "Acompanhe a emocionante história de Ele Não Conhece Misericórdia, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/el_A7nPzBKI/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/el_A7nPzBKI/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33733,
        "likesCount": 11806,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Ele Não Conhece Misericórdia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/el_A7nPzBKI",
                "durationSeconds": 1092,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Ele Não Conhece Misericórdia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LdLi6o9-LLo",
                "durationSeconds": 888,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Ele Não Conhece Misericórdia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FPq27QU0zeY",
                "durationSeconds": 1153,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Ele Não Conhece Misericórdia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/D_eKFH9JdmA",
                "durationSeconds": 1595,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Ele Não Conhece Misericórdia completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/N1g2CZpw7Eo",
                "durationSeconds": 849,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-alfa-torturada",
        "title": "A Alfa Torturada",
        "slug": "a-alfa-torturada",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em A Alfa Torturada.",
        "coverUrl": "https://img.youtube.com/vi/GbIkI7xhHG8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/GbIkI7xhHG8/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 6,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 27405,
        "likesCount": 9591,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Alfa Torturada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GbIkI7xhHG8",
                "durationSeconds": 832,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Alfa Torturada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OUue09qLumI",
                "durationSeconds": 832,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Alfa Torturada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LsMtevph2wM",
                "durationSeconds": 424,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Alfa Torturada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YDxZ5ojXOX0",
                "durationSeconds": 930,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Alfa Torturada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PzylJZvtdv8",
                "durationSeconds": 622,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Alfa Torturada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xfDaKkil1F0",
                "durationSeconds": 832,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-poder-alem-do-olhar",
        "title": "Poder Além do Olhar",
        "slug": "poder-alem-do-olhar",
        "synopsis": "Acompanhe a emocionante história de Poder Além do Olhar, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/-xYMAmUnHVU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/-xYMAmUnHVU/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 13304,
        "likesCount": 4656,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Poder Além do Olhar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-xYMAmUnHVU",
                "durationSeconds": 1719,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-uma-noite-com-o-meu-meio-irmao",
        "title": "Uma Noite com o Meu Meio-irmão",
        "slug": "uma-noite-com-o-meu-meio-irmao",
        "synopsis": "Acompanhe a emocionante história de Uma Noite com o Meu Meio-irmão, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/_QpzWgddITA/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/_QpzWgddITA/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32597,
        "likesCount": 11408,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Uma Noite com o Meu Meio-irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_QpzWgddITA",
                "durationSeconds": 1144,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Uma Noite com o Meu Meio-irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IPU1Wfe5Ek0",
                "durationSeconds": 290,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Uma Noite com o Meu Meio-irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hrkjAwpDjrQ",
                "durationSeconds": 648,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Uma Noite com o Meu Meio-irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hsJEI76hdG0",
                "durationSeconds": 450,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Uma Noite com o Meu Meio-irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HeGZgiorUog",
                "durationSeconds": 662,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Uma Noite com o Meu Meio-irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XEbAwmhI6d8",
                "durationSeconds": 1331,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Uma Noite com o Meu Meio-irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/T9Bo66MLjtA",
                "durationSeconds": 449,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Uma Noite com o Meu Meio-irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wdgh4wX584A",
                "durationSeconds": 272,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Uma Noite com o Meu Meio-irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0sfwZTbGMmY",
                "durationSeconds": 1152,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-acenda-meu-fogo",
        "title": "Acenda meu fogo",
        "slug": "acenda-meu-fogo",
        "synopsis": "Acompanhe a emocionante história de Acenda meu fogo, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/PRTJSgGl7Jg/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/PRTJSgGl7Jg/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 11,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 29735,
        "likesCount": 10407,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Acenda meu fogo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PRTJSgGl7Jg",
                "durationSeconds": 413,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Acenda meu fogo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JaxRSqL0cfI",
                "durationSeconds": 413,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Acenda meu fogo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JG19p0Auhfo",
                "durationSeconds": 567,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Acenda meu fogo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/w9zJ-U7HKqQ",
                "durationSeconds": 337,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Acenda meu fogo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Px4AmmTjGUU",
                "durationSeconds": 203,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Acenda meu fogo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FXf41JoLLBs",
                "durationSeconds": 441,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Acenda meu fogo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2ERBbS1rwfU",
                "durationSeconds": 446,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Acenda meu fogo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ut_gHjH1isM",
                "durationSeconds": 235,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Acenda meu fogo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nmMH8pnU8x4",
                "durationSeconds": 554,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Acenda meu fogo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UicTcrMlrWw",
                "durationSeconds": 471,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Acenda meu fogo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Y4xzIGx5f4E",
                "durationSeconds": 394,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-meus-cinco-maridos-bestiais",
        "title": "Meus Cinco Maridos Bestiais",
        "slug": "meus-cinco-maridos-bestiais",
        "synopsis": "Acompanhe a emocionante história de Meus Cinco Maridos Bestiais, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/FJXGfAR2b1A/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/FJXGfAR2b1A/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 9650,
        "likesCount": 3377,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Meus Cinco Maridos Bestiais completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FJXGfAR2b1A",
                "durationSeconds": 2045,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Meus Cinco Maridos Bestiais completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/g5BeiBFfM-8",
                "durationSeconds": 959,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-irma-errada-na-cama-dele",
        "title": "A Irmã Errada na Cama Dele",
        "slug": "a-irma-errada-na-cama-dele",
        "synopsis": "Acompanhe a emocionante história de A Irmã Errada na Cama Dele, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/1HF9wzaSnMM/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/1HF9wzaSnMM/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 30978,
        "likesCount": 10842,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Irmã Errada na Cama Dele completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1HF9wzaSnMM",
                "durationSeconds": 1804,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Irmã Errada na Cama Dele completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6TsgSwDpv-o",
                "durationSeconds": 1709,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-7-dias-de-casamento-com-o-duque-amaldicoado",
        "title": "7 Dias de Casamento com o Duque Amaldiçoado",
        "slug": "7-dias-de-casamento-com-o-duque-amaldicoado",
        "synopsis": "Um matrimônio selado por conveniência e obrigações familiares esconde sentimentos intensos e segredos proibidos em 7 Dias de Casamento com o Duque Amaldiçoado.",
        "coverUrl": "https://img.youtube.com/vi/ik9k-eqfv1A/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ik9k-eqfv1A/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,casamento-arranjado,romance,drama",
        "totalEpisodes": 6,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31639,
        "likesCount": 11073,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de 7 Dias de Casamento com o Duque Amaldiçoado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ik9k-eqfv1A",
                "durationSeconds": 1405,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de 7 Dias de Casamento com o Duque Amaldiçoado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/o7jZMnRTx70",
                "durationSeconds": 1270,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de 7 Dias de Casamento com o Duque Amaldiçoado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AZrKGQcLatc",
                "durationSeconds": 203,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de 7 Dias de Casamento com o Duque Amaldiçoado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/v8VBU_uRVsk",
                "durationSeconds": 1886,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de 7 Dias de Casamento com o Duque Amaldiçoado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/yyY6vAOgr64",
                "durationSeconds": 1414,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de 7 Dias de Casamento com o Duque Amaldiçoado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RvrxHm0wZTU",
                "durationSeconds": 1412,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-mais-espada-menos-batom",
        "title": "Mais Espada Menos Batom",
        "slug": "mais-espada-menos-batom",
        "synopsis": "Acompanhe a emocionante história de Mais Espada Menos Batom, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/RfuLW72jn94/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/RfuLW72jn94/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 7,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 11026,
        "likesCount": 3859,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Mais Espada Menos Batom completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/RfuLW72jn94",
                "durationSeconds": 360,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Mais Espada Menos Batom completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wDe1M095dAA",
                "durationSeconds": 360,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Mais Espada Menos Batom completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rEGLAqp-xdA",
                "durationSeconds": 360,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Mais Espada Menos Batom completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZzVbgxwl0Zw",
                "durationSeconds": 368,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Mais Espada Menos Batom completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/beNDVw6RIh0",
                "durationSeconds": 433,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Mais Espada Menos Batom completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lRFkJYo8JcA",
                "durationSeconds": 984,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Mais Espada Menos Batom completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qk_wvyZDuyU",
                "durationSeconds": 239,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-contrato-do-nosso-destino",
        "title": "O Contrato do Nosso Destino",
        "slug": "o-contrato-do-nosso-destino",
        "synopsis": "Um matrimônio selado por conveniência e obrigações familiares esconde sentimentos intensos e segredos proibidos em O Contrato do Nosso Destino.",
        "coverUrl": "https://img.youtube.com/vi/A9zXHkpsh7g/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/A9zXHkpsh7g/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 28909,
        "likesCount": 10118,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Contrato do Nosso Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/A9zXHkpsh7g",
                "durationSeconds": 1378,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Contrato do Nosso Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/IY63lJbCiPI",
                "durationSeconds": 1066,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Contrato do Nosso Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/M8wIkCBVP_s",
                "durationSeconds": 1279,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Contrato do Nosso Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ptm7GwIN2Nc",
                "durationSeconds": 1377,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Contrato do Nosso Destino completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/P51oFslkuPw",
                "durationSeconds": 1314,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-irmao-perigoso-do-meu-noivo",
        "title": "O Irmão Perigoso do Meu Noivo",
        "slug": "o-irmao-perigoso-do-meu-noivo",
        "synopsis": "Acompanhe a emocionante história de O Irmão Perigoso do Meu Noivo, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/kCaUdLvET9M/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/kCaUdLvET9M/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33081,
        "likesCount": 11578,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Irmão Perigoso do Meu Noivo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kCaUdLvET9M",
                "durationSeconds": 2591,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-despedida-do-coracao-partido",
        "title": "Despedida do Coração Partido",
        "slug": "despedida-do-coracao-partido",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Despedida do Coração Partido.",
        "coverUrl": "https://img.youtube.com/vi/0PL-Ldp2TzE/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/0PL-Ldp2TzE/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 14653,
        "likesCount": 5128,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Despedida do Coração Partido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0PL-Ldp2TzE",
                "durationSeconds": 1095,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Despedida do Coração Partido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Ie-1cbWeJGw",
                "durationSeconds": 1661,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Despedida do Coração Partido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ITgjhL1g_Hk",
                "durationSeconds": 1422,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Despedida do Coração Partido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ChCrhCMYPb8",
                "durationSeconds": 1426,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Despedida do Coração Partido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zVBT8GhBAQY",
                "durationSeconds": 1522,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Despedida do Coração Partido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_G6d7bHMPGo",
                "durationSeconds": 1411,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Despedida do Coração Partido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SBigkQlIZBs",
                "durationSeconds": 860,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Despedida do Coração Partido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HK5fAvUL0jc",
                "durationSeconds": 1521,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Despedida do Coração Partido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Oe-PiZTLUNg",
                "durationSeconds": 1560,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Despedida do Coração Partido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/X_UFSGZo5VQ",
                "durationSeconds": 1745,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-segunda-chance-primeiro-mimo",
        "title": "Segunda Chance Primeiro Mimo",
        "slug": "segunda-chance-primeiro-mimo",
        "synopsis": "Acompanhe a emocionante história de Segunda Chance Primeiro Mimo, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/_hT-FfDlA_w/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/_hT-FfDlA_w/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 26432,
        "likesCount": 9251,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Segunda Chance Primeiro Mimo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_hT-FfDlA_w",
                "durationSeconds": 558,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-quando-a-neve-derrete",
        "title": "Quando a Neve Derrete",
        "slug": "quando-a-neve-derrete",
        "synopsis": "Acompanhe a emocionante história de Quando a Neve Derrete, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/jOrAkJwC5Qc/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/jOrAkJwC5Qc/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34030,
        "likesCount": 11910,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Quando a Neve Derrete completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jOrAkJwC5Qc",
                "durationSeconds": 897,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Quando a Neve Derrete completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/m1s5TDrGXwg",
                "durationSeconds": 761,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Quando a Neve Derrete completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VNfuimPeJ8Q",
                "durationSeconds": 851,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Quando a Neve Derrete completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DRaO6uH880M",
                "durationSeconds": 1085,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-trocada-pela-irma-o-alfa-rejeitado",
        "title": "Trocada pela Irmã: O Alfa Rejeitado",
        "slug": "trocada-pela-irma-o-alfa-rejeitado",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em Trocada pela Irmã: O Alfa Rejeitado.",
        "coverUrl": "https://img.youtube.com/vi/bPQ0gswAQ_g/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/bPQ0gswAQ_g/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 6,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 18156,
        "likesCount": 6354,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Trocada pela Irmã: O Alfa Rejeitado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bPQ0gswAQ_g",
                "durationSeconds": 269,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Trocada pela Irmã: O Alfa Rejeitado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mQw_DJutfC0",
                "durationSeconds": 1254,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Trocada pela Irmã: O Alfa Rejeitado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4BmKpwRQM78",
                "durationSeconds": 1520,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Trocada pela Irmã: O Alfa Rejeitado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/C53JuQD9RME",
                "durationSeconds": 1564,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Trocada pela Irmã: O Alfa Rejeitado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vr28iuRqIB8",
                "durationSeconds": 1581,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Trocada pela Irmã: O Alfa Rejeitado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/45MmRBQ0YQY",
                "durationSeconds": 1811,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-5-lordes-e-a-filha-perdida",
        "title": "5 Lordes e a Filha Perdida",
        "slug": "5-lordes-e-a-filha-perdida",
        "synopsis": "Acompanhe a emocionante história de 5 Lordes e a Filha Perdida, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/YB3zuY6CNRU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/YB3zuY6CNRU/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 23595,
        "likesCount": 8258,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de 5 Lordes e a Filha Perdida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YB3zuY6CNRU",
                "durationSeconds": 1393,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de 5 Lordes e a Filha Perdida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kVoXSrleDOo",
                "durationSeconds": 1391,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de 5 Lordes e a Filha Perdida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hd4FS-i59nM",
                "durationSeconds": 2015,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-fera-do-amor",
        "title": "Fera do Amor",
        "slug": "fera-do-amor",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em Fera do Amor.",
        "coverUrl": "https://img.youtube.com/vi/PshSv-qZYDg/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/PshSv-qZYDg/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34469,
        "likesCount": 12064,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Fera do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PshSv-qZYDg",
                "durationSeconds": 1454,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-a-veterinaria-no-trono-das-feras",
        "title": "A Veterinária no Trono das Feras",
        "slug": "a-veterinaria-no-trono-das-feras",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em A Veterinária no Trono das Feras.",
        "coverUrl": "https://img.youtube.com/vi/hCbKhwO_ijE/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/hCbKhwO_ijE/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 21466,
        "likesCount": 7513,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Veterinária no Trono das Feras completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hCbKhwO_ijE",
                "durationSeconds": 471,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-orgulho-encontra-o-amor",
        "title": "Orgulho Encontra o Amor",
        "slug": "orgulho-encontra-o-amor",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Orgulho Encontra o Amor.",
        "coverUrl": "https://img.youtube.com/vi/-PhkN1jHgQk/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/-PhkN1jHgQk/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 6,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 20457,
        "likesCount": 7159,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Orgulho Encontra o Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-PhkN1jHgQk",
                "durationSeconds": 216,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Orgulho Encontra o Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/znVdLfY6CiI",
                "durationSeconds": 1064,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Orgulho Encontra o Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2KqfowIDtoU",
                "durationSeconds": 1064,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Orgulho Encontra o Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Yx5PXaT8iWg",
                "durationSeconds": 1347,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Orgulho Encontra o Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/P0DrO8DmDHQ",
                "durationSeconds": 1613,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Orgulho Encontra o Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/i96sMwWcK_M",
                "durationSeconds": 868,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-pedreiro-e-a-bilionaria",
        "title": "O Pedreiro e a Bilionária",
        "slug": "o-pedreiro-e-a-bilionaria",
        "synopsis": "Acompanhe a emocionante história de O Pedreiro e a Bilionária, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/2OIhdQYriug/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/2OIhdQYriug/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 13,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34387,
        "likesCount": 12035,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2OIhdQYriug",
                "durationSeconds": 1293,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/KNt36BqTjA0",
                "durationSeconds": 1293,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AJmpNV_gFjk",
                "durationSeconds": 1549,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/J4DSCBX41Ac",
                "durationSeconds": 1186,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Uu0NEeAhJN8",
                "durationSeconds": 1040,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SJojG-BhCdU",
                "durationSeconds": 1492,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZIETJ85UbjI",
                "durationSeconds": 1691,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7ImQrtO4lJ4",
                "durationSeconds": 1508,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/aowkAKmMkk4",
                "durationSeconds": 1155,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/deO1Perm1hs",
                "durationSeconds": 1293,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/iultTP_nNdk",
                "durationSeconds": 1187,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Qo2sL9pi5fI",
                "durationSeconds": 272,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de O Pedreiro e a Bilionária completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/iuAmps3opJ8",
                "durationSeconds": 1810,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-casei-com-um-garotao-apaixonado",
        "title": "Casei com um Garotão Apaixonado",
        "slug": "casei-com-um-garotao-apaixonado",
        "synopsis": "Acompanhe a emocionante história de Casei com um Garotão Apaixonado, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/a85_J_BJhlo/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/a85_J_BJhlo/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 24517,
        "likesCount": 8580,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Casei com um Garotão Apaixonado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/a85_J_BJhlo",
                "durationSeconds": 993,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Casei com um Garotão Apaixonado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BjGLxJGcEhw",
                "durationSeconds": 1026,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-entregador-falido",
        "title": "O Entregador Falido",
        "slug": "o-entregador-falido",
        "synopsis": "Acompanhe a emocionante história de O Entregador Falido, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/qNIF_Z5k2rk/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/qNIF_Z5k2rk/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 7,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 17079,
        "likesCount": 5977,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Entregador Falido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qNIF_Z5k2rk",
                "durationSeconds": 1655,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Entregador Falido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/n2ZL_vGfDNo",
                "durationSeconds": 1658,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Entregador Falido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CYceNz9Ogq8",
                "durationSeconds": 1719,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Entregador Falido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hWngmzGkG0M",
                "durationSeconds": 1658,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Entregador Falido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Dk_MXG6KyhI",
                "durationSeconds": 1719,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Entregador Falido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YMKkLF8epCo",
                "durationSeconds": 203,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Entregador Falido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zLSYQ_KkzCo",
                "durationSeconds": 787,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-obsessao-agridoce",
        "title": "Obsessão Agridoce",
        "slug": "obsessao-agridoce",
        "synopsis": "Acompanhe a emocionante história de Obsessão Agridoce, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/a43gEsyYgBg/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/a43gEsyYgBg/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33788,
        "likesCount": 11825,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Obsessão Agridoce completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/a43gEsyYgBg",
                "durationSeconds": 624,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-sayne-o-genro-humilhado",
        "title": "Sayne: O Genro Humilhado",
        "slug": "sayne-o-genro-humilhado",
        "synopsis": "Acompanhe a emocionante história de Sayne: O Genro Humilhado, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/ZNrjJ7DVe90/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ZNrjJ7DVe90/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 27246,
        "likesCount": 9536,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Sayne: O Genro Humilhado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZNrjJ7DVe90",
                "durationSeconds": 1529,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Sayne: O Genro Humilhado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jx2Lt-E0s5Q",
                "durationSeconds": 1737,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Sayne: O Genro Humilhado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0Q4QAFDl1g4",
                "durationSeconds": 1529,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-vendida-ao-rei-da-estrada",
        "title": "Vendida ao Rei da Estrada",
        "slug": "vendida-ao-rei-da-estrada",
        "synopsis": "Acompanhe a emocionante história de Vendida ao Rei da Estrada, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/EbokklOnfyU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/EbokklOnfyU/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 13530,
        "likesCount": 4735,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Vendida ao Rei da Estrada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EbokklOnfyU",
                "durationSeconds": 1722,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Vendida ao Rei da Estrada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Im9Z_QEuR78",
                "durationSeconds": 1722,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Vendida ao Rei da Estrada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/A_L9_102njU",
                "durationSeconds": 1833,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Vendida ao Rei da Estrada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FD50fBmMH_U",
                "durationSeconds": 1833,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Vendida ao Rei da Estrada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lmAiaa92jrY",
                "durationSeconds": 1117,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-quando-o-amor-desvanece",
        "title": "Quando o Amor Desvanece",
        "slug": "quando-o-amor-desvanece",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Quando o Amor Desvanece.",
        "coverUrl": "https://img.youtube.com/vi/g-kut-UqSlc/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/g-kut-UqSlc/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32682,
        "likesCount": 11438,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Quando o Amor Desvanece completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/g-kut-UqSlc",
                "durationSeconds": 577,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Quando o Amor Desvanece completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cKxdANQdm7U",
                "durationSeconds": 772,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Quando o Amor Desvanece completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BGa0LeSxjpE",
                "durationSeconds": 1096,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Quando o Amor Desvanece completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rIsKwWVuUyk",
                "durationSeconds": 936,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Quando o Amor Desvanece completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2-x9fiRBXLc",
                "durationSeconds": 546,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Quando o Amor Desvanece completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/eIYKVr3IK3o",
                "durationSeconds": 434,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Quando o Amor Desvanece completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/x1Tk-9aguAY",
                "durationSeconds": 1153,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Quando o Amor Desvanece completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HWpnnEaZjh4",
                "durationSeconds": 809,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Quando o Amor Desvanece completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NWV3OLc9gpo",
                "durationSeconds": 1131,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-alice-e-a-deusa-da-justica",
        "title": "Alice e a Deusa da Justiça",
        "slug": "alice-e-a-deusa-da-justica",
        "synopsis": "Acompanhe a emocionante história de Alice e a Deusa da Justiça, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/M--vFq3Qcfo/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/M--vFq3Qcfo/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 29601,
        "likesCount": 10360,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Alice e a Deusa da Justiça completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/M--vFq3Qcfo",
                "durationSeconds": 1563,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Alice e a Deusa da Justiça completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Qq1XK-XdWkg",
                "durationSeconds": 657,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Alice e a Deusa da Justiça completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FSaQN_GbDQw",
                "durationSeconds": 774,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-14-dias-de-casamento-falso",
        "title": "14 Dias de Casamento Falso",
        "slug": "14-dias-de-casamento-falso",
        "synopsis": "Um matrimônio selado por conveniência e obrigações familiares esconde sentimentos intensos e segredos proibidos em 14 Dias de Casamento Falso.",
        "coverUrl": "https://img.youtube.com/vi/iLbtzVDIoiw/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/iLbtzVDIoiw/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,casamento-arranjado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 9880,
        "likesCount": 3458,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de 14 Dias de Casamento Falso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/iLbtzVDIoiw",
                "durationSeconds": 914,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de 14 Dias de Casamento Falso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GzO10UwIASQ",
                "durationSeconds": 1487,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de 14 Dias de Casamento Falso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DzAyORH1ks8",
                "durationSeconds": 1474,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de 14 Dias de Casamento Falso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HMjORN3HEzs",
                "durationSeconds": 1673,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de 14 Dias de Casamento Falso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/f5qO1LSBdNY",
                "durationSeconds": 563,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-cowboy-bilionario-escondido",
        "title": "O Cowboy Bilionário Escondido",
        "slug": "o-cowboy-bilionario-escondido",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em O Cowboy Bilionário Escondido.",
        "coverUrl": "https://img.youtube.com/vi/NPj4tpY2boo/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/NPj4tpY2boo/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31093,
        "likesCount": 10882,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Cowboy Bilionário Escondido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NPj4tpY2boo",
                "durationSeconds": 252,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Cowboy Bilionário Escondido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/yAIvb8ENQ2U",
                "durationSeconds": 286,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-paixao-secreta-do-meu-marido",
        "title": "A Paixão Secreta do Meu Marido",
        "slug": "a-paixao-secreta-do-meu-marido",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em A Paixão Secreta do Meu Marido.",
        "coverUrl": "https://img.youtube.com/vi/YE3W50AAWJE/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/YE3W50AAWJE/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31534,
        "likesCount": 11036,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Paixão Secreta do Meu Marido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YE3W50AAWJE",
                "durationSeconds": 1334,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Paixão Secreta do Meu Marido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/sIRPYUwfUIM",
                "durationSeconds": 465,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-gravida-de-trigemeos",
        "title": "Grávida de Trigêmeos",
        "slug": "gravida-de-trigemeos",
        "synopsis": "Acompanhe a emocionante história de Grávida de Trigêmeos, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/88OKH59iIII/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/88OKH59iIII/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 10797,
        "likesCount": 3778,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Grávida de Trigêmeos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/88OKH59iIII",
                "durationSeconds": 1447,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Grávida de Trigêmeos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6r195vAUECM",
                "durationSeconds": 1441,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Grávida de Trigêmeos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HHIUKoHnkMs",
                "durationSeconds": 1257,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-garcom-magnata",
        "title": "O Garçom Magnata",
        "slug": "o-garcom-magnata",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em O Garçom Magnata.",
        "coverUrl": "https://img.youtube.com/vi/ngCcf8cI208/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ngCcf8cI208/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 29051,
        "likesCount": 10167,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Garçom Magnata completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ngCcf8cI208",
                "durationSeconds": 1689,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Garçom Magnata completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CJsKEiQDxJI",
                "durationSeconds": 1688,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Garçom Magnata completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JlG6kx2Iv3A",
                "durationSeconds": 1315,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Garçom Magnata completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vMvFRhV4rWs",
                "durationSeconds": 1689,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-paixao-tabu-meu-meio-irmao",
        "title": "Paixão Tabu: Meu Meio-Irmão",
        "slug": "paixao-tabu-meu-meio-irmao",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Paixão Tabu: Meu Meio-Irmão.",
        "coverUrl": "https://img.youtube.com/vi/z1mt3s-KRXs/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/z1mt3s-KRXs/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33005,
        "likesCount": 11551,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Paixão Tabu: Meu Meio-Irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/z1mt3s-KRXs",
                "durationSeconds": 854,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Paixão Tabu: Meu Meio-Irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qq4hgwYdWRM",
                "durationSeconds": 655,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Paixão Tabu: Meu Meio-Irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Olzlm_tnE2w",
                "durationSeconds": 1111,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Paixão Tabu: Meu Meio-Irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/pnhHa_Ajdyk",
                "durationSeconds": 1144,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-um-laco-perfumado",
        "title": "Um Laço Perfumado",
        "slug": "um-laco-perfumado",
        "synopsis": "Acompanhe a emocionante história de Um Laço Perfumado, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/vc06ukMEJtk/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/vc06ukMEJtk/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 14429,
        "likesCount": 5050,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Um Laço Perfumado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vc06ukMEJtk",
                "durationSeconds": 860,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Um Laço Perfumado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/N_a471KwxYM",
                "durationSeconds": 855,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Um Laço Perfumado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5a0a0RdYxhk",
                "durationSeconds": 906,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Um Laço Perfumado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8KSJCqDHbes",
                "durationSeconds": 1000,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-nascido-para-correr",
        "title": "Nascido para Correr",
        "slug": "nascido-para-correr",
        "synopsis": "Acompanhe a emocionante história de Nascido para Correr, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/ZHNsSXQ0gow/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ZHNsSXQ0gow/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 26598,
        "likesCount": 9309,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Nascido para Correr completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZHNsSXQ0gow",
                "durationSeconds": 1243,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-traida-e-dada-como-morta-ha-3-anos-ela-voltou-como-a-rainha-alfa",
        "title": "Traída e dada como morta há 3 anos, ela voltou como a Rainha Alfa!",
        "slug": "traida-e-dada-como-morta-ha-3-anos-ela-voltou-como-a-rainha-alfa",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em Traída e dada como morta há 3 anos, ela voltou como a Rainha Alfa!.",
        "coverUrl": "https://img.youtube.com/vi/SS7S0OaV8Ek/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/SS7S0OaV8Ek/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33986,
        "likesCount": 11895,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Traída e dada como morta há 3 anos, ela voltou como a Rainha Alfa! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SS7S0OaV8Ek",
                "durationSeconds": 1883,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-aos-10-mia-contratou-o-assassino-por-7-dias-e-descobriu-um-segredo",
        "title": "Aos 10, Mia Contratou o Assassino por 7 Dias… e Descobriu um Segredo!",
        "slug": "aos-10-mia-contratou-o-assassino-por-7-dias-e-descobriu-um-segredo",
        "synopsis": "Um matrimônio selado por conveniência e obrigações familiares esconde sentimentos intensos e segredos proibidos em Aos 10, Mia Contratou o Assassino por 7 Dias… e Descobriu um Segredo!.",
        "coverUrl": "https://img.youtube.com/vi/pAg8J46-_S0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/pAg8J46-_S0/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 17942,
        "likesCount": 6279,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Aos 10, Mia Contratou o Assassino por 7 Dias… e Descobriu um Segredo! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/pAg8J46-_S0",
                "durationSeconds": 1364,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-rejeitada-pelo-alfa",
        "title": "Rejeitada pelo Alfa",
        "slug": "rejeitada-pelo-alfa",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em Rejeitada pelo Alfa.",
        "coverUrl": "https://img.youtube.com/vi/1gQwgP8vT4s/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/1gQwgP8vT4s/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 23782,
        "likesCount": 8323,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Rejeitada pelo Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1gQwgP8vT4s",
                "durationSeconds": 1189,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Rejeitada pelo Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YfylB94MFYk",
                "durationSeconds": 1230,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-irma-roubou-seu-bilionario",
        "title": "A Irmã Roubou Seu Bilionário",
        "slug": "a-irma-roubou-seu-bilionario",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em A Irmã Roubou Seu Bilionário.",
        "coverUrl": "https://img.youtube.com/vi/mE08oj-7Y9E/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/mE08oj-7Y9E/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34456,
        "likesCount": 12059,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Irmã Roubou Seu Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mE08oj-7Y9E",
                "durationSeconds": 1653,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Irmã Roubou Seu Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nGUymTiIERo",
                "durationSeconds": 1340,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Irmã Roubou Seu Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wT3bEOJKyCE",
                "durationSeconds": 967,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-alfa-envenenado",
        "title": "O Alfa Envenenado",
        "slug": "o-alfa-envenenado",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em O Alfa Envenenado.",
        "coverUrl": "https://img.youtube.com/vi/ZcHp-iEQDKc/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ZcHp-iEQDKc/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 21266,
        "likesCount": 7443,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Alfa Envenenado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZcHp-iEQDKc",
                "durationSeconds": 1707,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Alfa Envenenado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/06pFVcJwlOA",
                "durationSeconds": 1163,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-kane-18-anos-preso",
        "title": "Kane: 18 Anos Preso",
        "slug": "kane-18-anos-preso",
        "synopsis": "Acompanhe a emocionante história de Kane: 18 Anos Preso, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/HZawTMw1DlA/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/HZawTMw1DlA/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 20661,
        "likesCount": 7231,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Kane: 18 Anos Preso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HZawTMw1DlA",
                "durationSeconds": 1373,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Kane: 18 Anos Preso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/423s1pkzPq0",
                "durationSeconds": 1376,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Kane: 18 Anos Preso completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7oAwbFxN1Qc",
                "durationSeconds": 1232,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-alem-do-sangue-e-da-traicao",
        "title": "Além do Sangue e da Traição",
        "slug": "alem-do-sangue-e-da-traicao",
        "synopsis": "Acompanhe a emocionante história de Além do Sangue e da Traição, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/BTZ07aIY5EA/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/BTZ07aIY5EA/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34408,
        "likesCount": 12042,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Além do Sangue e da Traição completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BTZ07aIY5EA",
                "durationSeconds": 1719,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Além do Sangue e da Traição completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zAd-lTDolUA",
                "durationSeconds": 1914,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Além do Sangue e da Traição completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/r3465oUoNMI",
                "durationSeconds": 1628,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Além do Sangue e da Traição completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/oKGHMFyfM_I",
                "durationSeconds": 1886,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Além do Sangue e da Traição completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6MkDdLYN16k",
                "durationSeconds": 1959,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-hades-renascido",
        "title": "Hades Renascido",
        "slug": "hades-renascido",
        "synopsis": "Acompanhe a emocionante história de Hades Renascido, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/5XUhYDgAq0c/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/5XUhYDgAq0c/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 24335,
        "likesCount": 8517,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Hades Renascido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5XUhYDgAq0c",
                "durationSeconds": 1269,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Hades Renascido completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jWVKp8f1K4A",
                "durationSeconds": 773,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-quando-ela-acordar",
        "title": "Quando Ela Acordar",
        "slug": "quando-ela-acordar",
        "synopsis": "Acompanhe a emocionante história de Quando Ela Acordar, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/dZJVREpj7TA/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/dZJVREpj7TA/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 20,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 17296,
        "likesCount": 6053,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dZJVREpj7TA",
                "durationSeconds": 1932,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7RLstUfx2wA",
                "durationSeconds": 2153,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NHV2V0lAK5w",
                "durationSeconds": 960,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/40Mvz64lsHs",
                "durationSeconds": 1495,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1b7yqTgvHkY",
                "durationSeconds": 607,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XGHzJ1A54yM",
                "durationSeconds": 2050,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ma_D16_kuIs",
                "durationSeconds": 1352,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6AS_-1_H87Y",
                "durationSeconds": 1941,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kCfT82fY9yw",
                "durationSeconds": 1640,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zocO5-2rFBY",
                "durationSeconds": 1534,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MtsqdzyAZqQ",
                "durationSeconds": 1432,
                "isFree": false
            },
            {
                "number": 12,
                "title": "Parte 12",
                "description": "Episódio 12 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vR3Jm8UZ3C8",
                "durationSeconds": 502,
                "isFree": false
            },
            {
                "number": 13,
                "title": "Parte 13",
                "description": "Episódio 13 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MbxIYuv_o2Y",
                "durationSeconds": 1412,
                "isFree": false
            },
            {
                "number": 14,
                "title": "Parte 14",
                "description": "Episódio 14 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/u0sCLJCzxJM",
                "durationSeconds": 1869,
                "isFree": false
            },
            {
                "number": 15,
                "title": "Parte 15",
                "description": "Episódio 15 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QFnu3EFc6b0",
                "durationSeconds": 1817,
                "isFree": false
            },
            {
                "number": 16,
                "title": "Parte 16",
                "description": "Episódio 16 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OV_LqxrqJ4A",
                "durationSeconds": 1233,
                "isFree": false
            },
            {
                "number": 17,
                "title": "Parte 17",
                "description": "Episódio 17 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1RGEVGyqB4M",
                "durationSeconds": 1148,
                "isFree": false
            },
            {
                "number": 18,
                "title": "Parte 18",
                "description": "Episódio 18 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Wu7_R8jvKwc",
                "durationSeconds": 1884,
                "isFree": false
            },
            {
                "number": 19,
                "title": "Parte 19",
                "description": "Episódio 19 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zSg1wfh6v34",
                "durationSeconds": 1857,
                "isFree": false
            },
            {
                "number": 20,
                "title": "Parte 20",
                "description": "Episódio 20 de Quando Ela Acordar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6-CqK1y7vjQ",
                "durationSeconds": 790,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-venci-meu-passado-casando-com-ele",
        "title": "Venci Meu Passado Casando com Ele",
        "slug": "venci-meu-passado-casando-com-ele",
        "synopsis": "Acompanhe a emocionante história de Venci Meu Passado Casando com Ele, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/6d9-WUef7u4/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/6d9-WUef7u4/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33840,
        "likesCount": 11844,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Venci Meu Passado Casando com Ele completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6d9-WUef7u4",
                "durationSeconds": 1220,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Venci Meu Passado Casando com Ele completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/r9FBgfXRXv0",
                "durationSeconds": 1215,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Venci Meu Passado Casando com Ele completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/qseExkWUpfg",
                "durationSeconds": 1189,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Venci Meu Passado Casando com Ele completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DhrIwZfnlVo",
                "durationSeconds": 1047,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Venci Meu Passado Casando com Ele completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bFUCihC5wPU",
                "durationSeconds": 1220,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-paixao-proibida-pelo-pastor",
        "title": "Paixão Proibida pelo Pastor",
        "slug": "paixao-proibida-pelo-pastor",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Paixão Proibida pelo Pastor.",
        "coverUrl": "https://img.youtube.com/vi/bXOA9u00M1w/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/bXOA9u00M1w/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 27086,
        "likesCount": 9480,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Paixão Proibida pelo Pastor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bXOA9u00M1w",
                "durationSeconds": 913,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Paixão Proibida pelo Pastor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kpujzVTnkXo",
                "durationSeconds": 1384,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Paixão Proibida pelo Pastor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Lf0AYQr_3gQ",
                "durationSeconds": 1467,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Paixão Proibida pelo Pastor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/t3VEkyml8hY",
                "durationSeconds": 727,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Paixão Proibida pelo Pastor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nG3qCzmMIXo",
                "durationSeconds": 1091,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-confesse-ou-seja-apagado",
        "title": "Confesse ou Seja Apagado",
        "slug": "confesse-ou-seja-apagado",
        "synopsis": "Acompanhe a emocionante história de Confesse ou Seja Apagado, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/0f4Ao4igZno/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/0f4Ao4igZno/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 13755,
        "likesCount": 4814,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Confesse ou Seja Apagado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0f4Ao4igZno",
                "durationSeconds": 1562,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Confesse ou Seja Apagado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2FBvtr5M-4k",
                "durationSeconds": 1306,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Confesse ou Seja Apagado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ieD4h6nFZE8",
                "durationSeconds": 455,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Confesse ou Seja Apagado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Sc4vZLHq2Ak",
                "durationSeconds": 451,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Confesse ou Seja Apagado completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2J-SeI1b0Jk",
                "durationSeconds": 456,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-casadainesperadamente-com-o-ceo",
        "title": "CasadaInesperadamente com o CEO",
        "slug": "casadainesperadamente-com-o-ceo",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em CasadaInesperadamente com o CEO.",
        "coverUrl": "https://img.youtube.com/vi/XqcxcKftddY/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/XqcxcKftddY/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bilionario,ceo,luxo,casamento-arranjado,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32766,
        "likesCount": 11468,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de CasadaInesperadamente com o CEO completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XqcxcKftddY",
                "durationSeconds": 899,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de CasadaInesperadamente com o CEO completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/A90d3hflGD4",
                "durationSeconds": 184,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de CasadaInesperadamente com o CEO completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/u3tOlbSIxy4",
                "durationSeconds": 875,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-memorias-de-um-inocente",
        "title": "Memórias de Um Inocente",
        "slug": "memorias-de-um-inocente",
        "synopsis": "Acompanhe a emocionante história de Memórias de Um Inocente, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/bHwg0RIWzJg/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/bHwg0RIWzJg/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 29466,
        "likesCount": 10313,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Memórias de Um Inocente completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bHwg0RIWzJg",
                "durationSeconds": 1215,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Memórias de Um Inocente completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/YzsogmX9cJs",
                "durationSeconds": 1000,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Memórias de Um Inocente completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hQ112Yw3EE0",
                "durationSeconds": 1505,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-duas-vezes-era-uma-vez",
        "title": "Duas Vezes Era uma Vez",
        "slug": "duas-vezes-era-uma-vez",
        "synopsis": "Acompanhe a emocionante história de Duas Vezes Era uma Vez, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/ayWuVysnxA0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ayWuVysnxA0/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 11,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 10109,
        "likesCount": 3538,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Duas Vezes Era uma Vez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ayWuVysnxA0",
                "durationSeconds": 464,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Duas Vezes Era uma Vez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HBDRjTtUvtU",
                "durationSeconds": 464,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Duas Vezes Era uma Vez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AogPcAu-jhc",
                "durationSeconds": 547,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Duas Vezes Era uma Vez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Brk0i_mUwkw",
                "durationSeconds": 791,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Duas Vezes Era uma Vez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Rf9cajj_uow",
                "durationSeconds": 326,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Duas Vezes Era uma Vez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6WpkV1nL4YE",
                "durationSeconds": 750,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Duas Vezes Era uma Vez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/l0SHFyObXhU",
                "durationSeconds": 532,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Duas Vezes Era uma Vez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/i_Kz7yHaIWE",
                "durationSeconds": 821,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Duas Vezes Era uma Vez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4bEc0esn-Kc",
                "durationSeconds": 766,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Duas Vezes Era uma Vez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_svCZpEqotc",
                "durationSeconds": 553,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de Duas Vezes Era uma Vez completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nYSuc0s4JA8",
                "durationSeconds": 991,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-forcados-a-casar-decididos-a-amar",
        "title": "Forçados a Casar Decididos a Amar",
        "slug": "forcados-a-casar-decididos-a-amar",
        "synopsis": "Acompanhe a emocionante história de Forçados a Casar Decididos a Amar, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/37SONvB3L_E/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/37SONvB3L_E/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31206,
        "likesCount": 10922,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Forçados a Casar Decididos a Amar completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/37SONvB3L_E",
                "durationSeconds": 746,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-por-favor-me-ame-de-novo",
        "title": "Por Favor, Me Ame de Novo",
        "slug": "por-favor-me-ame-de-novo",
        "synopsis": "Acompanhe a emocionante história de Por Favor, Me Ame de Novo, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/uqsXWs_IbME/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/uqsXWs_IbME/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31426,
        "likesCount": 10999,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Por Favor, Me Ame de Novo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uqsXWs_IbME",
                "durationSeconds": 1059,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Por Favor, Me Ame de Novo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NmmRloBsILg",
                "durationSeconds": 965,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Por Favor, Me Ame de Novo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PyC0lMiZvOA",
                "durationSeconds": 1294,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Por Favor, Me Ame de Novo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4Eb7jMQhvuk",
                "durationSeconds": 1313,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-assumindo-o-lugar-da-gemea",
        "title": "Assumindo o Lugar da Gêmea",
        "slug": "assumindo-o-lugar-da-gemea",
        "synopsis": "Acompanhe a emocionante história de Assumindo o Lugar da Gêmea, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/lzp_szo2yBU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/lzp_szo2yBU/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 10568,
        "likesCount": 3698,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Assumindo o Lugar da Gêmea completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lzp_szo2yBU",
                "durationSeconds": 1106,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Assumindo o Lugar da Gêmea completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rjVQUTVwGxU",
                "durationSeconds": 1269,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-mulher-que-o-ceo-esqueceu",
        "title": "A Mulher que o CEO Esqueceu",
        "slug": "a-mulher-que-o-ceo-esqueceu",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em A Mulher que o CEO Esqueceu.",
        "coverUrl": "https://img.youtube.com/vi/Yrz44oIx5KQ/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Yrz44oIx5KQ/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 7,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 29191,
        "likesCount": 10216,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Mulher que o CEO Esqueceu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Yrz44oIx5KQ",
                "durationSeconds": 789,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Mulher que o CEO Esqueceu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GryWl12TwEE",
                "durationSeconds": 716,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Mulher que o CEO Esqueceu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0Ss4ehwtqqk",
                "durationSeconds": 816,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Mulher que o CEO Esqueceu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WZYB_dxhGJA",
                "durationSeconds": 701,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Mulher que o CEO Esqueceu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/pkgMng4P-Ms",
                "durationSeconds": 744,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de A Mulher que o CEO Esqueceu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5fImWRKOD0o",
                "durationSeconds": 927,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de A Mulher que o CEO Esqueceu completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ox1IDxI7-5g",
                "durationSeconds": 830,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-jogo-do-carma",
        "title": "O Jogo do Carma",
        "slug": "o-jogo-do-carma",
        "synopsis": "Acompanhe a emocionante história de O Jogo do Carma, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/JuW1-jSj8Co/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/JuW1-jSj8Co/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 8,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32927,
        "likesCount": 11524,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Jogo do Carma completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JuW1-jSj8Co",
                "durationSeconds": 478,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Jogo do Carma completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DZACibKfV8g",
                "durationSeconds": 1656,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Jogo do Carma completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4FZ7V60jaTk",
                "durationSeconds": 1325,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Jogo do Carma completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/CCywqracNxM",
                "durationSeconds": 1129,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Jogo do Carma completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/N7L4pCU4AdY",
                "durationSeconds": 444,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Jogo do Carma completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/E5eo9zwPHiM",
                "durationSeconds": 395,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Jogo do Carma completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wdZLVUzXfho",
                "durationSeconds": 351,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de O Jogo do Carma completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/phZFv0t_Gno",
                "durationSeconds": 641,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-meu-inimigo-me-engravidou",
        "title": "Meu Inimigo Me Engravidou",
        "slug": "meu-inimigo-me-engravidou",
        "synopsis": "Acompanhe a emocionante história de Meu Inimigo Me Engravidou, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/P-5lCX0VyT4/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/P-5lCX0VyT4/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 14205,
        "likesCount": 4971,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Meu Inimigo Me Engravidou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/P-5lCX0VyT4",
                "durationSeconds": 520,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Meu Inimigo Me Engravidou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/md1rFyI__JE",
                "durationSeconds": 676,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Meu Inimigo Me Engravidou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GOEFpSbt1XU",
                "durationSeconds": 522,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Meu Inimigo Me Engravidou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/64gKKg1UttY",
                "durationSeconds": 495,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Meu Inimigo Me Engravidou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HJdCqeNg0Mg",
                "durationSeconds": 506,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-meu-bully-meu-irmao",
        "title": "Meu Bully, Meu Irmão",
        "slug": "meu-bully-meu-irmao",
        "synopsis": "Acompanhe a emocionante história de Meu Bully, Meu Irmão, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/2rC64OkVIr0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/2rC64OkVIr0/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 26762,
        "likesCount": 9366,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Meu Bully, Meu Irmão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/2rC64OkVIr0",
                "durationSeconds": 359,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-7-dias-internada-a-herdeira-descobriu-que-sua-propria-familia-queria-ve-la-",
        "title": "7 Dias Internada: A Herdeira Descobriu que Sua Própria Família Queria Vê-la Morta!",
        "slug": "7-dias-internada-a-herdeira-descobriu-que-sua-propria-familia-queria-ve-la-",
        "synopsis": "Acompanhe a emocionante história de 7 Dias Internada: A Herdeira Descobriu que Sua Própria Família Queria Vê-la Morta!, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/DUMx1KQqEvc/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/DUMx1KQqEvc/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33939,
        "likesCount": 11878,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de 7 Dias Internada: A Herdeira Descobriu que Sua Própria Família Queria Vê-la Morta! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DUMx1KQqEvc",
                "durationSeconds": 451,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-a-coroa-do-mendigo-oculto",
        "title": "A Coroa do Mendigo Oculto",
        "slug": "a-coroa-do-mendigo-oculto",
        "synopsis": "Acompanhe a emocionante história de A Coroa do Mendigo Oculto, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/l6eT8mlIhx8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/l6eT8mlIhx8/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 17727,
        "likesCount": 6204,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Coroa do Mendigo Oculto completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/l6eT8mlIhx8",
                "durationSeconds": 1212,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-bebe-secreto-papai-bilionario",
        "title": "Bebê Secreto Papai Bilionário",
        "slug": "bebe-secreto-papai-bilionario",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em Bebê Secreto Papai Bilionário.",
        "coverUrl": "https://img.youtube.com/vi/_ZaDeFXioS8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/_ZaDeFXioS8/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 23968,
        "likesCount": 8388,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Bebê Secreto Papai Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_ZaDeFXioS8",
                "durationSeconds": 824,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Bebê Secreto Papai Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Eya7JFHbkyA",
                "durationSeconds": 870,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Bebê Secreto Papai Bilionário completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/noID2j5C744",
                "durationSeconds": 736,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-chama-da-lua-alfa-e-cacador",
        "title": "Chama da Lua: Alfa e Caçador",
        "slug": "chama-da-lua-alfa-e-cacador",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em Chama da Lua: Alfa e Caçador.",
        "coverUrl": "https://img.youtube.com/vi/zSI3BNudg9k/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/zSI3BNudg9k/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34442,
        "likesCount": 12054,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Chama da Lua: Alfa e Caçador completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zSI3BNudg9k",
                "durationSeconds": 843,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Chama da Lua: Alfa e Caçador completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wjsaTcJ4n5U",
                "durationSeconds": 802,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Chama da Lua: Alfa e Caçador completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Fb4ar79j_E8",
                "durationSeconds": 759,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Chama da Lua: Alfa e Caçador completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VmDuWlIPo9k",
                "durationSeconds": 459,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Chama da Lua: Alfa e Caçador completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OXjPBlCXx-4",
                "durationSeconds": 652,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Chama da Lua: Alfa e Caçador completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WDVHrZQBqLU",
                "durationSeconds": 655,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Chama da Lua: Alfa e Caçador completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tI-qulXCJ30",
                "durationSeconds": 871,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Chama da Lua: Alfa e Caçador completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/O5gF_toKgIQ",
                "durationSeconds": 748,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Chama da Lua: Alfa e Caçador completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QNfAuWRES10",
                "durationSeconds": 744,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Chama da Lua: Alfa e Caçador completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/JqB4M9HYswA",
                "durationSeconds": 705,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-por-18-anos-chamaram-a-herdeira-de-camponesa-ate-a-verdade-destruir-rachel",
        "title": "Por 18 anos chamaram a herdeira de camponesa… até a verdade destruir Rachel!",
        "slug": "por-18-anos-chamaram-a-herdeira-de-camponesa-ate-a-verdade-destruir-rachel",
        "synopsis": "Acompanhe a emocionante história de Por 18 anos chamaram a herdeira de camponesa… até a verdade destruir Rachel!, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/tE04QwHYjKc/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/tE04QwHYjKc/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 21065,
        "likesCount": 7372,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Por 18 anos chamaram a herdeira de camponesa… até a verdade destruir Rachel! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tE04QwHYjKc",
                "durationSeconds": 1660,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-o-escudeiro-imortal-1000-anos",
        "title": "O Escudeiro Imortal (1000 Anos)",
        "slug": "o-escudeiro-imortal-1000-anos",
        "synopsis": "Acompanhe a emocionante história de O Escudeiro Imortal (1000 Anos), com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/n84lf3ovSoI/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/n84lf3ovSoI/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 20864,
        "likesCount": 7302,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Escudeiro Imortal (1000 Anos) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/n84lf3ovSoI",
                "durationSeconds": 1456,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Escudeiro Imortal (1000 Anos) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/b30HRCyUKWs",
                "durationSeconds": 606,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Escudeiro Imortal (1000 Anos) completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/xn3d8gLHFrA",
                "durationSeconds": 1134,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-meu-unico-e-verdadeiro-amor",
        "title": "Meu Único e Verdadeiro Amor",
        "slug": "meu-unico-e-verdadeiro-amor",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Meu Único e Verdadeiro Amor.",
        "coverUrl": "https://img.youtube.com/vi/ET3tR9_hIcY/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ET3tR9_hIcY/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34426,
        "likesCount": 12049,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Meu Único e Verdadeiro Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ET3tR9_hIcY",
                "durationSeconds": 1000,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Meu Único e Verdadeiro Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Pbtr-eIfKcI",
                "durationSeconds": 931,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Meu Único e Verdadeiro Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VxwmgT7FJWQ",
                "durationSeconds": 1081,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Meu Único e Verdadeiro Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UROb5GP5FjY",
                "durationSeconds": 1019,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Meu Único e Verdadeiro Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FdcxYpPrv0c",
                "durationSeconds": 1061,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Meu Único e Verdadeiro Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/LC4MMpaWbHY",
                "durationSeconds": 956,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Meu Único e Verdadeiro Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0n_f3NqGbhM",
                "durationSeconds": 994,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Meu Único e Verdadeiro Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/K__97DWFoyg",
                "durationSeconds": 875,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Meu Único e Verdadeiro Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bA4jGMrv_Jk",
                "durationSeconds": 912,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Meu Único e Verdadeiro Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/P1QWDmui7wY",
                "durationSeconds": 1094,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-expulso-por-esparta-ele-escolheu-3-rejeitadas-e-fez-300-guerreiros-tremerem",
        "title": "Expulso por Esparta, ele escolheu 3 rejeitadas… e fez 300 guerreiros tremerem!",
        "slug": "expulso-por-esparta-ele-escolheu-3-rejeitadas-e-fez-300-guerreiros-tremerem",
        "synopsis": "Acompanhe a emocionante história de Expulso por Esparta, ele escolheu 3 rejeitadas… e fez 300 guerreiros tremerem!, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/Xpb0lKdlie4/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Xpb0lKdlie4/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 24151,
        "likesCount": 8452,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Expulso por Esparta, ele escolheu 3 rejeitadas… e fez 300 guerreiros tremerem! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Xpb0lKdlie4",
                "durationSeconds": 592,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-a-vinganca-da-diva",
        "title": "A Vingança da Diva",
        "slug": "a-vinganca-da-diva",
        "synopsis": "Humilhado no passado, o retorno triunfal para cobrar cada dívida e proteger quem ama abala as estruturas de todos os traidores em A Vingança da Diva.",
        "coverUrl": "https://img.youtube.com/vi/FtR18dWckcQ/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/FtR18dWckcQ/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,vinganca,poder,romance,drama",
        "totalEpisodes": 3,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 17512,
        "likesCount": 6129,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Vingança da Diva completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/FtR18dWckcQ",
                "durationSeconds": 464,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Vingança da Diva completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lhbX70Cgjys",
                "durationSeconds": 420,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Vingança da Diva completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kPslp3Bb-jI",
                "durationSeconds": 450,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-desejo-oculto-do-ceo",
        "title": "O Desejo Oculto do CEO",
        "slug": "o-desejo-oculto-do-ceo",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em O Desejo Oculto do CEO.",
        "coverUrl": "https://img.youtube.com/vi/HUKoMnVFbLk/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/HUKoMnVFbLk/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33891,
        "likesCount": 11861,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Desejo Oculto do CEO completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/HUKoMnVFbLk",
                "durationSeconds": 28,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-renascida-como-parceira-do-alfa",
        "title": "Renascida como Parceira do Alfa",
        "slug": "renascida-como-parceira-do-alfa",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em Renascida como Parceira do Alfa.",
        "coverUrl": "https://img.youtube.com/vi/Gj6_aT4GOik/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Gj6_aT4GOik/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 26925,
        "likesCount": 9423,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Renascida como Parceira do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Gj6_aT4GOik",
                "durationSeconds": 1485,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Renascida como Parceira do Alfa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gx3t8fmHTZ0",
                "durationSeconds": 1596,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-7-corridas-mil-humilhacoes-ele-era-o-rei-das-pistas",
        "title": "7 Corridas, Mil Humilhações… Ele Era o Rei das Pistas!",
        "slug": "7-corridas-mil-humilhacoes-ele-era-o-rei-das-pistas",
        "synopsis": "Acompanhe a emocionante história de 7 Corridas, Mil Humilhações… Ele Era o Rei das Pistas!, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/obuSCZyBreQ/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/obuSCZyBreQ/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 13981,
        "likesCount": 4893,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de 7 Corridas, Mil Humilhações… Ele Era o Rei das Pistas! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/obuSCZyBreQ",
                "durationSeconds": 683,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-a-filha-do-inferno-chegou",
        "title": "A Filha do Inferno Chegou",
        "slug": "a-filha-do-inferno-chegou",
        "synopsis": "Acompanhe a emocionante história de A Filha do Inferno Chegou, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/L2RgJ0pNGsI/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/L2RgJ0pNGsI/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32848,
        "likesCount": 11496,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Filha do Inferno Chegou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/L2RgJ0pNGsI",
                "durationSeconds": 887,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de A Filha do Inferno Chegou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7YJ4gbEfSeA",
                "durationSeconds": 913,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de A Filha do Inferno Chegou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MEKMrkjcORg",
                "durationSeconds": 893,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de A Filha do Inferno Chegou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/r2Evq6UZmlE",
                "durationSeconds": 795,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de A Filha do Inferno Chegou completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/lT5aKu-hOcY",
                "durationSeconds": 911,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-traida-e-morta-chloe-renasceu-em-7-dias-casou-se-com-o-bilionario-e-deu-o-t",
        "title": "Traída e Morta, Chloe Renasceu: Em 7 Dias, Casou-se com o Bilionário e Deu o Troco!",
        "slug": "traida-e-morta-chloe-renasceu-em-7-dias-casou-se-com-o-bilionario-e-deu-o-t",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em Traída e Morta, Chloe Renasceu: Em 7 Dias, Casou-se com o Bilionário e Deu o Troco!.",
        "coverUrl": "https://img.youtube.com/vi/Q1CVhvPH9OE/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Q1CVhvPH9OE/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 29329,
        "likesCount": 10265,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Traída e Morta, Chloe Renasceu: Em 7 Dias, Casou-se com o Bilionário e Deu o Troco! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Q1CVhvPH9OE",
                "durationSeconds": 761,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-eu-odeio-voce-eu-quero-voce",
        "title": "Eu Odeio Você, Eu Quero Você",
        "slug": "eu-odeio-voce-eu-quero-voce",
        "synopsis": "Acompanhe a emocionante história de Eu Odeio Você, Eu Quero Você, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/36r2nW15J2c/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/36r2nW15J2c/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 10339,
        "likesCount": 3618,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Eu Odeio Você, Eu Quero Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/36r2nW15J2c",
                "durationSeconds": 969,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Eu Odeio Você, Eu Quero Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UdVCqej1JGE",
                "durationSeconds": 387,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Eu Odeio Você, Eu Quero Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/-FmsdTCpKWA",
                "durationSeconds": 969,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Eu Odeio Você, Eu Quero Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/KN2jWlKgSZY",
                "durationSeconds": 1755,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Eu Odeio Você, Eu Quero Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NYxVeDwBXV8",
                "durationSeconds": 618,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Eu Odeio Você, Eu Quero Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1gn76KsjeGk",
                "durationSeconds": 1646,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Eu Odeio Você, Eu Quero Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QZbW7v3Xvq0",
                "durationSeconds": 875,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Eu Odeio Você, Eu Quero Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/uTsUWM2MGM8",
                "durationSeconds": 1771,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Eu Odeio Você, Eu Quero Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/MJWVtkSyDEM",
                "durationSeconds": 1778,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Eu Odeio Você, Eu Quero Você completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6wGHg1RKPJQ",
                "durationSeconds": 863,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-1-troca-de-gemeas-o-bilionario-descobriu-quem-o-salvou-ela-nao-devia-estar-",
        "title": "1 Troca de Gêmeas… O Bilionário Descobriu Quem o Salvou — Ela Não Devia Estar Viva!",
        "slug": "1-troca-de-gemeas-o-bilionario-descobriu-quem-o-salvou-ela-nao-devia-estar-",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em 1 Troca de Gêmeas… O Bilionário Descobriu Quem o Salvou — Ela Não Devia Estar Viva!.",
        "coverUrl": "https://img.youtube.com/vi/T-JVaNlddVU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/T-JVaNlddVU/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31317,
        "likesCount": 10960,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de 1 Troca de Gêmeas… O Bilionário Descobriu Quem o Salvou — Ela Não Devia Estar Viva! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/T-JVaNlddVU",
                "durationSeconds": 759,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-trocada-na-maternidade-a-esposa-do-bilionario-voltou-apos-18-anos-e-todos-v",
        "title": "Trocada na maternidade, a esposa do bilionário voltou após 18 anos — e todos vão se ajoelhar!",
        "slug": "trocada-na-maternidade-a-esposa-do-bilionario-voltou-apos-18-anos-e-todos-v",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em Trocada na maternidade, a esposa do bilionário voltou após 18 anos — e todos vão se ajoelhar!.",
        "coverUrl": "https://img.youtube.com/vi/WcK1jwRO4w0/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/WcK1jwRO4w0/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31316,
        "likesCount": 10960,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Trocada na maternidade, a esposa do bilionário voltou após 18 anos — e todos vão se ajoelhar! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WcK1jwRO4w0",
                "durationSeconds": 1327,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-filho-do-lobo",
        "title": "Filho do Lobo",
        "slug": "filho-do-lobo",
        "synopsis": "Lendas ancestrais, vínculos eternos de almas gêmeas e batalhas ferozes pelo trono supremo revelam os maiores mistérios em Filho do Lobo.",
        "coverUrl": "https://img.youtube.com/vi/vaxIwEfK0OU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/vaxIwEfK0OU/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,fantasia,sobrenatural,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 10338,
        "likesCount": 3618,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Filho do Lobo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/vaxIwEfK0OU",
                "durationSeconds": 933,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Filho do Lobo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/289gx9O_QRQ",
                "durationSeconds": 1174,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Filho do Lobo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ID-ZCnsALPA",
                "durationSeconds": 969,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Filho do Lobo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7m3_suMf_Ls",
                "durationSeconds": 969,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Filho do Lobo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4iIu41KBf7Y",
                "durationSeconds": 2085,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Filho do Lobo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mtKpZnprLdM",
                "durationSeconds": 1313,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Filho do Lobo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/_VCpKk49XA8",
                "durationSeconds": 1184,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Filho do Lobo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/k-qCIt1F_jk",
                "durationSeconds": 892,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Filho do Lobo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Mq7soMZ3fyU",
                "durationSeconds": 1265,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Filho do Lobo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ShW8tZ9j5Lk",
                "durationSeconds": 1006,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-amor-a-margem",
        "title": "Amor à Margem",
        "slug": "amor-a-margem",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Amor à Margem.",
        "coverUrl": "https://img.youtube.com/vi/mRHD1DVtolI/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/mRHD1DVtolI/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 10,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 29329,
        "likesCount": 10265,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Amor à Margem completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/mRHD1DVtolI",
                "durationSeconds": 1088,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Amor à Margem completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/z6jJQqk6w14",
                "durationSeconds": 414,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Amor à Margem completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/OKPs3SJjz7Q",
                "durationSeconds": 383,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Amor à Margem completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/S6ELhwdTl20",
                "durationSeconds": 1006,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Amor à Margem completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cQIa5oUawrE",
                "durationSeconds": 1394,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Amor à Margem completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UphSjsLtYNU",
                "durationSeconds": 238,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Amor à Margem completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/8DdYOTNw4qw",
                "durationSeconds": 743,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de Amor à Margem completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fFZVrfA0iLk",
                "durationSeconds": 276,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de Amor à Margem completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/q3itH9aiF0Q",
                "durationSeconds": 581,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de Amor à Margem completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/q1QtAtL9AMU",
                "durationSeconds": 635,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-papai-voce-pode-ouvir-meu-choro",
        "title": "Papai, Você Pode Ouvir Meu Choro?",
        "slug": "papai-voce-pode-ouvir-meu-choro",
        "synopsis": "Acompanhe a emocionante história de Papai, Você Pode Ouvir Meu Choro?, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/XfoG5-nUbnU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/XfoG5-nUbnU/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32847,
        "likesCount": 11496,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Papai, Você Pode Ouvir Meu Choro? completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XfoG5-nUbnU",
                "durationSeconds": 4446,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-meu-marido-bilionario-de-duas-caras",
        "title": "Meu Marido Bilionário de Duas Caras",
        "slug": "meu-marido-bilionario-de-duas-caras",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em Meu Marido Bilionário de Duas Caras.",
        "coverUrl": "https://img.youtube.com/vi/Wvz4x19DUUw/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/Wvz4x19DUUw/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,bilionario,ceo,luxo,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 13980,
        "likesCount": 4893,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Meu Marido Bilionário de Duas Caras completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Wvz4x19DUUw",
                "durationSeconds": 321,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Meu Marido Bilionário de Duas Caras completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EFuZGTi26SQ",
                "durationSeconds": 226,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Meu Marido Bilionário de Duas Caras completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1E2yM3dpWxw",
                "durationSeconds": 227,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Meu Marido Bilionário de Duas Caras completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Zc8NSn_i6_w",
                "durationSeconds": 454,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-beijo-que-virou-namoro",
        "title": "O Beijo Que Virou Namoro",
        "slug": "o-beijo-que-virou-namoro",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em O Beijo Que Virou Namoro.",
        "coverUrl": "https://img.youtube.com/vi/m_rH6pll_mY/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/m_rH6pll_mY/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 26925,
        "likesCount": 9423,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Beijo Que Virou Namoro completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/m_rH6pll_mY",
                "durationSeconds": 800,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-amor-em-meio-as-chamas",
        "title": "Amor em Meio às Chamas",
        "slug": "amor-em-meio-as-chamas",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Amor em Meio às Chamas.",
        "coverUrl": "https://img.youtube.com/vi/6hWd7znEpuU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/6hWd7znEpuU/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33891,
        "likesCount": 11861,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Amor em Meio às Chamas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6hWd7znEpuU",
                "durationSeconds": 773,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Amor em Meio às Chamas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Epkh64-czpA",
                "durationSeconds": 958,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Amor em Meio às Chamas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/fgmhvTBmJzg",
                "durationSeconds": 328,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Amor em Meio às Chamas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/1lLBVkqojlo",
                "durationSeconds": 1059,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Amor em Meio às Chamas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/XJ2wbt8iRhw",
                "durationSeconds": 1139,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-silencio-do-coracao-noiva-substituta-e-estrela-politica-em-ascensao",
        "title": "Silêncio do Coração: Noiva Substituta e Estrela Política em Ascensão",
        "slug": "silencio-do-coracao-noiva-substituta-e-estrela-politica-em-ascensao",
        "synopsis": "Um matrimônio selado por conveniência e obrigações familiares esconde sentimentos intensos e segredos proibidos em Silêncio do Coração: Noiva Substituta e Estrela Política em Ascensão.",
        "coverUrl": "https://img.youtube.com/vi/v1z18RghLWY/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/v1z18RghLWY/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,casamento-arranjado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 17512,
        "likesCount": 6129,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Silêncio do Coração: Noiva Substituta e Estrela Política em Ascensão completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/v1z18RghLWY",
                "durationSeconds": 4415,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-por-3-meses-ele-fingiu-ser-marido-do-magnata-mas-acabou-loucamente-apaixona",
        "title": "Por 3 Meses, Ele Fingiu Ser Marido do Magnata… Mas Acabou Loucamente Apaixonado!",
        "slug": "por-3-meses-ele-fingiu-ser-marido-do-magnata-mas-acabou-loucamente-apaixona",
        "synopsis": "Um poderoso magnata acostumado a comandar impérios descobre que o verdadeiro amor não tem preço quando seu destino cruza com uma mulher destemida em Por 3 Meses, Ele Fingiu Ser Marido do Magnata… Mas Acabou Loucamente Apaixonado!.",
        "coverUrl": "https://img.youtube.com/vi/7jv0nvGtqKM/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/7jv0nvGtqKM/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 24152,
        "likesCount": 8453,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Por 3 Meses, Ele Fingiu Ser Marido do Magnata… Mas Acabou Loucamente Apaixonado! completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7jv0nvGtqKM",
                "durationSeconds": 1434,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-amor-na-brisa-do-crepusculo",
        "title": "Amor na Brisa do Crepúsculo",
        "slug": "amor-na-brisa-do-crepusculo",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Amor na Brisa do Crepúsculo.",
        "coverUrl": "https://img.youtube.com/vi/61oFtbiD0tk/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/61oFtbiD0tk/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34426,
        "likesCount": 12049,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Amor na Brisa do Crepúsculo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/61oFtbiD0tk",
                "durationSeconds": 775,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Amor na Brisa do Crepúsculo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/z0yS6m4tcxY",
                "durationSeconds": 722,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Amor na Brisa do Crepúsculo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/jUaK35CgOV8",
                "durationSeconds": 494,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Amor na Brisa do Crepúsculo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ohWC-drsoeY",
                "durationSeconds": 293,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Amor na Brisa do Crepúsculo completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4s5saun1Js8",
                "durationSeconds": 794,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-sexo-de-reconciliacao",
        "title": "Sexo de Reconciliação",
        "slug": "sexo-de-reconciliacao",
        "synopsis": "Acompanhe a emocionante história de Sexo de Reconciliação, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/wnHjZnguyjY/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/wnHjZnguyjY/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 20863,
        "likesCount": 7302,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Sexo de Reconciliação completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/wnHjZnguyjY",
                "durationSeconds": 190,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-o-pacto-alem-do-estadio",
        "title": "O Pacto Além do Estádio",
        "slug": "o-pacto-alem-do-estadio",
        "synopsis": "Acompanhe a emocionante história de O Pacto Além do Estádio, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/g_rDg7XzC4U/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/g_rDg7XzC4U/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 21066,
        "likesCount": 7373,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Pacto Além do Estádio completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/g_rDg7XzC4U",
                "durationSeconds": 1448,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-sussurros-no-marques",
        "title": "Sussurros no Marquês",
        "slug": "sussurros-no-marques",
        "synopsis": "Acompanhe a emocionante história de Sussurros no Marquês, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/cFAqDhY33_g/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/cFAqDhY33_g/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 34442,
        "likesCount": 12054,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Sussurros no Marquês completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cFAqDhY33_g",
                "durationSeconds": 1091,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Sussurros no Marquês completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Emlw9x61QIs",
                "durationSeconds": 1406,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Sussurros no Marquês completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Wdya4vvmPtc",
                "durationSeconds": 983,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Sussurros no Marquês completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/l9GDr5kpQng",
                "durationSeconds": 1233,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-espadachim-do-zelador",
        "title": "O Espadachim do Zelador",
        "slug": "o-espadachim-do-zelador",
        "synopsis": "Acompanhe a emocionante história de O Espadachim do Zelador, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/AM74HNABdQw/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/AM74HNABdQw/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 23967,
        "likesCount": 8388,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Espadachim do Zelador completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AM74HNABdQw",
                "durationSeconds": 554,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-do-peso-a-gloria",
        "title": "Do Peso à Glória",
        "slug": "do-peso-a-gloria",
        "synopsis": "Acompanhe a emocionante história de Do Peso à Glória, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/ZzS8mmueSoQ/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ZzS8mmueSoQ/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 17728,
        "likesCount": 6204,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Do Peso à Glória completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZzS8mmueSoQ",
                "durationSeconds": 217,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Do Peso à Glória completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/rSuoH7HMwSw",
                "durationSeconds": 297,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-abismo-congelado-do-amor",
        "title": "O Abismo Congelado do Amor",
        "slug": "o-abismo-congelado-do-amor",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em O Abismo Congelado do Amor.",
        "coverUrl": "https://img.youtube.com/vi/nwRs8Qd4c5U/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/nwRs8Qd4c5U/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 11,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33939,
        "likesCount": 11878,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Abismo Congelado do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/nwRs8Qd4c5U",
                "durationSeconds": 831,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Abismo Congelado do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/gEL5gulwNfs",
                "durationSeconds": 934,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de O Abismo Congelado do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NZ3hViSRElc",
                "durationSeconds": 1208,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de O Abismo Congelado do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dNR8TK1eS7Y",
                "durationSeconds": 868,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de O Abismo Congelado do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tjK3Wbb7Zs0",
                "durationSeconds": 800,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de O Abismo Congelado do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9vnrNBCeN54",
                "durationSeconds": 512,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de O Abismo Congelado do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UanyKu8h7eM",
                "durationSeconds": 641,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de O Abismo Congelado do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/hsYCwYy3XlQ",
                "durationSeconds": 756,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de O Abismo Congelado do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/DEeabTjyuu8",
                "durationSeconds": 651,
                "isFree": false
            },
            {
                "number": 10,
                "title": "Parte 10",
                "description": "Episódio 10 de O Abismo Congelado do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/pwUsIjz-j4o",
                "durationSeconds": 978,
                "isFree": false
            },
            {
                "number": 11,
                "title": "Parte 11",
                "description": "Episódio 11 de O Abismo Congelado do Amor completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5PcrbXdM_8A",
                "durationSeconds": 646,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-coracao-em-duas-promessas",
        "title": "Coração em Duas Promessas",
        "slug": "coracao-em-duas-promessas",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Coração em Duas Promessas.",
        "coverUrl": "https://img.youtube.com/vi/5kj0G58crMw/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/5kj0G58crMw/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 26762,
        "likesCount": 9366,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Coração em Duas Promessas completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/5kj0G58crMw",
                "durationSeconds": 873,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-toque-da-fortuna",
        "title": "Toque da Fortuna",
        "slug": "toque-da-fortuna",
        "synopsis": "Acompanhe a emocionante história de Toque da Fortuna, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/tjzlQLwcyQU/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/tjzlQLwcyQU/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 14205,
        "likesCount": 4971,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Toque da Fortuna completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/tjzlQLwcyQU",
                "durationSeconds": 226,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Toque da Fortuna completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/X3Zyu6qZCrM",
                "durationSeconds": 1008,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Toque da Fortuna completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/WBilrR7zU54",
                "durationSeconds": 1058,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Toque da Fortuna completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/3K7GDG77wew",
                "durationSeconds": 1029,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Toque da Fortuna completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/PnsDiPrMmIU",
                "durationSeconds": 751,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-promessas-quebradas-oceanos-de-distancia",
        "title": "Promessas Quebradas Oceanos de Distância",
        "slug": "promessas-quebradas-oceanos-de-distancia",
        "synopsis": "Acompanhe a emocionante história de Promessas Quebradas Oceanos de Distância, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/9mitaPLdMi8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/9mitaPLdMi8/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 7,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32927,
        "likesCount": 11524,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Promessas Quebradas Oceanos de Distância completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/9mitaPLdMi8",
                "durationSeconds": 1011,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Promessas Quebradas Oceanos de Distância completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/dpEzdmWRXRw",
                "durationSeconds": 1011,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Promessas Quebradas Oceanos de Distância completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/SlQYcur9Gy4",
                "durationSeconds": 1187,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Promessas Quebradas Oceanos de Distância completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/yjxyuCCmPO0",
                "durationSeconds": 1187,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Promessas Quebradas Oceanos de Distância completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/A3CSUBHt4ec",
                "durationSeconds": 1133,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Promessas Quebradas Oceanos de Distância completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/zIzswsM_mWE",
                "durationSeconds": 1150,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de Promessas Quebradas Oceanos de Distância completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/Z3Orlm_mq0U",
                "durationSeconds": 1416,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-amor-entre-a-nevoa",
        "title": "Amor Entre a Névoa",
        "slug": "amor-entre-a-nevoa",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Amor Entre a Névoa.",
        "coverUrl": "https://img.youtube.com/vi/r0fc7xWud1c/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/r0fc7xWud1c/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 29190,
        "likesCount": 10216,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Amor Entre a Névoa completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/r0fc7xWud1c",
                "durationSeconds": 1211,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-general-do-meu-coracao",
        "title": "General do Meu Coração",
        "slug": "general-do-meu-coracao",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em General do Meu Coração.",
        "coverUrl": "https://img.youtube.com/vi/P5y1LH9asTg/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/P5y1LH9asTg/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 9,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 10569,
        "likesCount": 3699,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de General do Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/P5y1LH9asTg",
                "durationSeconds": 955,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de General do Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/q2CKkCj5HOY",
                "durationSeconds": 1101,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de General do Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0yfTHvs7mOc",
                "durationSeconds": 938,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de General do Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4LhYCQ_-qKY",
                "durationSeconds": 665,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de General do Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/agWMyS03EwE",
                "durationSeconds": 923,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de General do Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/7mTq2exvRAg",
                "durationSeconds": 994,
                "isFree": false
            },
            {
                "number": 7,
                "title": "Parte 7",
                "description": "Episódio 7 de General do Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/U-tXa1yzyHw",
                "durationSeconds": 1049,
                "isFree": false
            },
            {
                "number": 8,
                "title": "Parte 8",
                "description": "Episódio 8 de General do Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VOrGSPlcnzU",
                "durationSeconds": 994,
                "isFree": false
            },
            {
                "number": 9,
                "title": "Parte 9",
                "description": "Episódio 9 de General do Meu Coração completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/BapX6_KpDrs",
                "durationSeconds": 1106,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-amor-em-fragmentos",
        "title": "Amor em Fragmentos",
        "slug": "amor-em-fragmentos",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Amor em Fragmentos.",
        "coverUrl": "https://img.youtube.com/vi/bGdmGZTvJQ4/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/bGdmGZTvJQ4/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 5,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31426,
        "likesCount": 10999,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Amor em Fragmentos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/bGdmGZTvJQ4",
                "durationSeconds": 705,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Amor em Fragmentos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/NGzND4OHmXw",
                "durationSeconds": 1317,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Amor em Fragmentos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/oFuzKO0BsPs",
                "durationSeconds": 1317,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Amor em Fragmentos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/A3XiCy1s4CE",
                "durationSeconds": 736,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Amor em Fragmentos completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/EgmyoI_YbMs",
                "durationSeconds": 781,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-beleza-frianova-vida",
        "title": "Beleza FriaNova Vida",
        "slug": "beleza-frianova-vida",
        "synopsis": "Acompanhe a emocionante história de Beleza FriaNova Vida, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/j4hqwZ8dJ_c/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/j4hqwZ8dJ_c/hqdefault.jpg",
        "category": "Dublado",
        "tags": "dublado,romance,drama",
        "totalEpisodes": 4,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 31205,
        "likesCount": 10921,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Beleza FriaNova Vida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/j4hqwZ8dJ_c",
                "durationSeconds": 962,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Beleza FriaNova Vida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/QCovJ7QTx84",
                "durationSeconds": 1103,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Beleza FriaNova Vida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/AzWzdtVUKyY",
                "durationSeconds": 1245,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Beleza FriaNova Vida completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cEpLUMo1J1k",
                "durationSeconds": 1178,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-curandeiro-encantador",
        "title": "O Curandeiro Encantador",
        "slug": "o-curandeiro-encantador",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em O Curandeiro Encantador.",
        "coverUrl": "https://img.youtube.com/vi/UWZMzENPDc8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/UWZMzENPDc8/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 10109,
        "likesCount": 3538,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Curandeiro Encantador completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/UWZMzENPDc8",
                "durationSeconds": 257,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-destino-irreversivel",
        "title": "Destino Irreversível",
        "slug": "destino-irreversivel",
        "synopsis": "Marcados por feridas do passado, duas vidas encontram no afeto e na cumplicidade o caminho para a redenção e a felicidade em Destino Irreversível.",
        "coverUrl": "https://img.youtube.com/vi/6Pu0JUuQpDI/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/6Pu0JUuQpDI/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 6,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 29466,
        "likesCount": 10313,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Destino Irreversível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/6Pu0JUuQpDI",
                "durationSeconds": 1261,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de Destino Irreversível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/K-anDyRDNp8",
                "durationSeconds": 1619,
                "isFree": false
            },
            {
                "number": 3,
                "title": "Parte 3",
                "description": "Episódio 3 de Destino Irreversível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/0sKoAlgg1Sg",
                "durationSeconds": 1851,
                "isFree": false
            },
            {
                "number": 4,
                "title": "Parte 4",
                "description": "Episódio 4 de Destino Irreversível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/4aqoeqnuZC0",
                "durationSeconds": 1619,
                "isFree": false
            },
            {
                "number": 5,
                "title": "Parte 5",
                "description": "Episódio 5 de Destino Irreversível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/kWcA2vJuGoE",
                "durationSeconds": 1223,
                "isFree": false
            },
            {
                "number": 6,
                "title": "Parte 6",
                "description": "Episódio 6 de Destino Irreversível completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/C0coUfNkW5Q",
                "durationSeconds": 1272,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-o-ultimo-testemunho-da-irma",
        "title": "O Último Testemunho da Irmã",
        "slug": "o-ultimo-testemunho-da-irma",
        "synopsis": "Acompanhe a emocionante história de O Último Testemunho da Irmã, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/ZtgaJDNQ614/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/ZtgaJDNQ614/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 2,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 32766,
        "likesCount": 11468,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de O Último Testemunho da Irmã completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/ZtgaJDNQ614",
                "durationSeconds": 891,
                "isFree": true
            },
            {
                "number": 2,
                "title": "Parte 2",
                "description": "Episódio 2 de O Último Testemunho da Irmã completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/cw1ljxfMAPw",
                "durationSeconds": 1129,
                "isFree": false
            }
        ]
    },
    {
        "id": "tdx-a-boa-menina",
        "title": "A Boa Menina",
        "slug": "a-boa-menina",
        "synopsis": "Acompanhe a emocionante história de A Boa Menina, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/GgO6RnImYq4/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/GgO6RnImYq4/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 13755,
        "likesCount": 4814,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Boa Menina completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/GgO6RnImYq4",
                "durationSeconds": 818,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-a-vida-roubada",
        "title": "A Vida Roubada",
        "slug": "a-vida-roubada",
        "synopsis": "Acompanhe a emocionante história de A Vida Roubada, com reviravoltas de tirar o fôlego, intrigas familiares e um romance inesquecível dublado em alta definição.",
        "coverUrl": "https://img.youtube.com/vi/skhr5lzS0sY/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/skhr5lzS0sY/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 27087,
        "likesCount": 9480,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de A Vida Roubada completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/skhr5lzS0sY",
                "durationSeconds": 1337,
                "isFree": true
            }
        ]
    },
    {
        "id": "tdx-noiva-renascida-perseguicao-sem-fim-do-principe-regente",
        "title": "Noiva Renascida, Perseguição Sem Fim do Príncipe Regente",
        "slug": "noiva-renascida-perseguicao-sem-fim-do-principe-regente",
        "synopsis": "Humilhado no passado, o retorno triunfal para cobrar cada dívida e proteger quem ama abala as estruturas de todos os traidores em Noiva Renascida, Perseguição Sem Fim do Príncipe Regente.",
        "coverUrl": "https://img.youtube.com/vi/VOBWvshkwH8/hqdefault.jpg",
        "bannerUrl": "https://img.youtube.com/vi/VOBWvshkwH8/hqdefault.jpg",
        "category": "Legendado",
        "tags": "Legendado, dublado,casamento-arranjado,romance,drama",
        "totalEpisodes": 1,
        "freeEpisodesCount": 1,
        "isFeatured": false,
        "isVertical": true,
        "viewsCount": 33840,
        "likesCount": 11844,
        "episodes": [
            {
                "number": 1,
                "title": "Parte 1",
                "description": "Episódio 1 de Noiva Renascida, Perseguição Sem Fim do Príncipe Regente completo e dublado em alta definição.",
                "youtubeUrl": "https://youtu.be/VOBWvshkwH8",
                "durationSeconds": 593,
                "isFree": true
            }
        ]
    }
];
