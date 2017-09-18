package com.scf.inlet;

import com.vie.jct.kit.Felixor;
import com.vie.jct.start.Runner;

public class OsgiBoujour {
    public static void main(final String[] args) {
        // 删缓存
        Felixor.cleanBundles("felix/cache");
        // 运行Felix
        Runner.runOsgi(OsgiBoujour.class);
    }
}
