export class Workout {
  public codeModule: String;
  public titre: String;
  public description: String;
  public dureeEstimee: String;
  public type: String;
  public lienDocument: String;
  public etat: String;
  public dateDebutPrevue: String;
  public dateDebutReelle: String;
  public dateFinPrevue: String;
  public dateFinReelle: String;
  public commentaire: String;
  public feedback: String;
  
  constructor(codeModule, titre, description, dureeEstime, type, lienDocument, etat, 
      dateDebutPrevue, dateDebutReelle, dateFinPrevue, dateFinReelle, commentaire, feedback) {
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
  }
}
