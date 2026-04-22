package com.naval.tracker.model;

public class PositionUpdate {
    private String id;
    private double latitude;
    private double longitude;

    public PositionUpdate() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
}