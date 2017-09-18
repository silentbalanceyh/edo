Import(['Formula']);
/*
 * Tree结构的查询
 * 
 * @returns
 */
function QTree() {
    this._criteria = {};
}

(function() {
    var _branch = function(left, right, op){
        var expr = {};
        if(!op) op = "AND";
        expr["$LEFT$"] = left;
        expr["$OP$"] = op;
        expr["$RIGHT$"] = right;
        return expr;
    }
    var _add = function(ref, field, value, op){
        var length = Object.keys(ref).length;
        if(0 == length){
            // 一个表达式都没有
            var formula = new Formula(field);
            return formula._(value);
        }else{
            var expr = {};
            // 左子树为原始表达式
            var left = ref;
            var formula = new Formula(field);
            var right = formula._(value);
            // 构建新查询树
            return _branch(left, right, op);
        }
    }
    QTree.prototype = {
        and : function(field, value) {
            this._criteria = _add(this._criteria, field, value);
            return this;
        },
        or : function(field, value) {
            this._criteria = _add(this._criteria, field, value, "OR");
            return this;
        },
        connect: function(tree, op){
            var length = Object.keys(this._criteria).length;
            if(0 == length){
                this._criteria = tree._();
            }else{
                this._criteria = _branch(this._criteria, tree._(), op);
            }
        },
        _: function(){
            return this._criteria;
        }
    }
})();
