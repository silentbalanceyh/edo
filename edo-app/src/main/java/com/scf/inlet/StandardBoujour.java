package com.scf.inlet;

import com.vie.jct.start.Runner;
import com.vie.jct.start.Tackler;

public class StandardBoujour {
    public static void main(final String... args) throws InterruptedException {
        // 0.跑Meta Server
        Runner.runMeta(StandardBoujour.class);

        // 1.先处理Meta
        Tackler.runSchema(DeployBoujour.class);
        // 2.再处理Data
        Tackler.runData(DeployBoujour.class);


        Runner.runEngine(StandardBoujour.class);
    }
}
