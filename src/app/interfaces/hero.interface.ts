export interface Hero {
    id: string;
    name: string;
    description: string;
    power: string;
    image: string,
    createdAt: Date
}

export const exampleHero: Hero = {
    id: '123',
    name: 'Spiderman',
    description: 'A superhero with spider-like abilities.',
    power: 'spider-sense',
    image: '',
    createdAt: new Date()
};