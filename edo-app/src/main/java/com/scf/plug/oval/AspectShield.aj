package com.scf.plug.oval;

import net.sf.oval.guard.GuardAspect;

/**
 * OVal + AspectJ共同使用的合成类，启用AspectJ的OVal框架必须的代码
 * @author Lang
 * @see
 */
public aspect AspectShield extends GuardAspect {
    public AspectShield() {
        super();
        /** 是不是开发环境才会使用这个东西有待商榷 **/
    }
}
