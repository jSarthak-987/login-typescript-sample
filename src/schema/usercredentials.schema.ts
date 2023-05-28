export interface UserCredentials {
    name: string,
    email: string,
    phone: number,
    password: string,
    address: string,
    state: string,
    city: string,
    hobbies: UserHobbies[]
}

interface UserHobbies {
    title: string
}