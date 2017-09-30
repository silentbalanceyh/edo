package com.scf.dev;

import com.vie.jct.start.Tackler;

public class SignIssuer {

    public static void main(final String args[]) {
        Tackler.runSign(SignIssuer.class,
                "sec.resource",
                "publicKey",
                "sec.role.matrix",
                "privateKey");
    }
}
