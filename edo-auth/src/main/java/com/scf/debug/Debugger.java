package com.scf.debug;

import com.vie.jdbc.impl.DataConnection;
import com.vie.une.Instance;

public class Debugger {
    public static void main(final String[] args) {
        Instance.singleton(DataConnection.class);
    }
}
