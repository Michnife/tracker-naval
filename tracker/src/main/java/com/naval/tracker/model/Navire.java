package com.naval.tracker.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "navires")
public class Navire {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    private String id;
    private String nom;
    private String type;      // "fregate", "sous-marin", "drone"
    private double latitude;
    private double longitude;
    private String statut;    // "en mission", "au port", "en alerte"

    @ManyToOne
    @JoinColumn(name = "groupe_id")
    @JsonIgnoreProperties({"navires", "sousGroupes"})
    private Groupe groupe;

    public Groupe getGroupe() {
        return groupe;
    }

    public void setGroupe(Groupe groupe) {
        this.groupe = groupe;
    }

    public Navire() {}

    public Navire(String id, String nom, String type, double latitude, double longitude, String statut, Groupe groupe) {
        this.id = id;
        this.nom = nom;
        this.type = type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.statut = statut;
        this.groupe = groupe;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}