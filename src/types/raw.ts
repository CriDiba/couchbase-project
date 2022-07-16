export type RawChannel = {
    id: string,
    title: string,
    lag: string
}

export type RawProgram = {
    pid: string,
    genre: string,
    subgenre: string
}

export type RawUser = {
    user_id: string,
    family_id: string,
    is_subscriber: string,
    gender: string,
    year_of_birth: string,
    age: string,
    age_class: string,
    occupation: string,
    cultural_background: string,
    fam_socio_economic_class: string,
    fam_city_size: string
}

export type RawUserPreference = {
    user: string,
    family_id: string,
    epg_channel_id: string,
    seconds: string,
    preference: string
}

export type RawTvViewing = {
    id: string,
    user: string,
    family_id: string,
    group_id: string,
    program_id: string,
    epg_channel_id: string,
    starttime: string,
    endtime: string,
    time_slot: string,
    day_of_week: string
}