package com.scf.inlet;

import com.vie.jct.start.Tackler;

public class DeployBoujour {

    public static void main(final String[] args) {
        // 1.先处理Meta
        Tackler.runSchema(DeployBoujour.class);
        // 2.再处理Data
        Tackler.runData(DeployBoujour.class);
    }
}
