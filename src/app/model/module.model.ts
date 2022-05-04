import {Workout} from "./workout.model";

export class Module {
    public code: String;
    public libelle: String;
    public description: String;
    public workoutList: Workout[];
    public avancement: number;

    constructor(code, libelle, description) {
        this.code = code;
        this.libelle = libelle;
        this.description = description;
    }
}
