export type User = {
    id: string,
    familyId: string,
    isSubscriber: boolean,
    gender: number,
    yearOfBirth: number,
    age: number,
    ageClass: number,
    occupation: number,
    culturalBackground: number,
    famSocioEconomicClass: number,
    famCitySize: number
    preferences: UserPreference[]
    viewings: string[]
}

export type UserPreference = {
    channelId: string,
    seconds: number,
    preference: number
}
