export class Coach {
    public name: string;
    public description: string;
    public image: string;
    public site: string;
    public mail: string;
    constructor(name, description, image, site, mail){
        this.name = name;
        this.description = description;
        this.image = image;
        this.site = site;
        this.mail = mail;
    }
}
