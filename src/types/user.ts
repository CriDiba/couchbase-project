export type User = {
    id: string,
    familyId: string,
    isSubscriber: boolean,
    gender: number,
    yearOfBirth: number,
    age: number,
    ageClass: number,
    occupation: number,
    cultural366146Background: number,
    famSocioEconomicClass: number,
    famCitySize: number
    preferences: UserPreference[]
    viewings: Viewing[]
}

export type UserPreference = {
    channelId: string,
    seconds: number,
    preference: number
}

export type Viewing = {
    id: string,
    groupId: string,
    programId: string,
    channelId: string,
    startTime: string,
    endTime: string,
    timeSlot: string,
    dayOfWeek: string
}