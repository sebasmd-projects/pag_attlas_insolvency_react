export interface Translations {
    translations: TranslationsClass;
}

export interface TranslationsClass {
    home: Home;
}

export interface Home {
    meta:     Meta;
    sections: Sections;
}

export interface Meta {
    pageTitle:       string;
    metaDescription: string;
    metaKeywords:    string[];
    metaOpenGraph:   MetaOpenGraph;
    metaTwitter:     MetaTwitter;
    metaRobots:      string;
    applicationName: string;
    authors:         Author[];
    icons:           Icons;
    manifest:        string;
}

export interface Author {
    name: string;
    url:  string;
}

export interface Icons {
    icon:  string;
    apple: string;
}

export interface MetaOpenGraph {
    title:       string;
    description: string;
    url:         string;
    siteName:    string;
    images:      Image[];
}

export interface Image {
    url:    string;
    width:  number;
    height: number;
    alt:    string;
}

export interface MetaTwitter {
    title:       string;
    description: string;
    images:      string[];
}

export interface Sections {
    hero:      Hero;
    education: Education;
    about:     About;
    services:  About;
    team:      About;
    contact:   About;
}

export interface About {
    title:    string;
    subtitle: string;
}

export interface Education {
    title:   string;
    altImgs: string[];
}

export interface Hero {
    video:              string;
    title:              string;
    subtitle:           string;
    altLogo:            string;
    whatsAppButton:     string;
    askConcerns:        string;
    talkToLawyer:       string;
    messagePlaceholder: string;
}
