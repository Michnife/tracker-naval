package com.naval.tracker.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "groupes")
public class Groupe {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    private String id;

    private String nom;
    private String couleur;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    @JsonIgnoreProperties("sousGroupes")
    private Groupe parent;

    @OneToMany(mappedBy = "parent")
    @JsonIgnoreProperties("parent")
    private List<Groupe> sousGroupes = new ArrayList<>();

    @OneToMany(mappedBy = "groupe")
    @JsonIgnoreProperties("groupe")
    private List<Navire> navires = new ArrayList<>();

    public Groupe() {}

    public Groupe(String id, String nom, String couleur) {
        this.id = id;
        this.nom = nom;
        this.couleur = couleur;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getCouleur() {
        return couleur;
    }

    public void setCouleur(String couleur) {
        this.couleur = couleur;
    }

    public Groupe getParent() {
        return parent;
    }

    public void setParent(Groupe parent) {
        this.parent = parent;
    }

    public List<Groupe> getSousGroupes() {
        return sousGroupes;
    }

    public List<Navire> getNavires() {
        return navires;
    }
}
