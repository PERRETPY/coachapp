export class Workout {
  public codeModule: string;
  public titre: string;
  public description: string;
  public dureeEstimee: string;
  public type: string;
  public lienDocument: string;
  public etat: string;
  public dateDebutPrevue: string;
  public dateDebutReelle: string;
  public dateFinPrevue: string;
  public dateFinReelle: string;
  public commentaire: string;
  public feedback: string;
  public range: number;
  public daysLate: number;

  constructor(codeModule, titre, description, dureeEstime, type, lienDocument, etat,
      dateDebutPrevue, dateDebutReelle, dateFinPrevue, dateFinReelle, commentaire, feedback, range, daysLate) {
        this.codeModule = codeModule;
        this.titre = titre;
        this.description = description;
        this.dureeEstimee = dureeEstime;
        this.type = type;
        this.lienDocument = lienDocument;
        this.etat = etat;
        this.dateDebutPrevue = dateDebutPrevue;
        this.dateDebutReelle = dateDebutReelle;
        this.dateFinPrevue = dateFinPrevue;
        this.dateFinReelle = dateFinReelle;
        this.commentaire = commentaire;
        this.feedback = feedback;
        this.range = range;
        this.daysLate = daysLate;
  }
}
