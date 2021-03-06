var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { TranslateService } from '@ngx-translate/core';
import { Connector } from '../Connector';
import { CONDITION_CONNECTOR_HEIGHT_DELTA, CONDITION_FOOTER_SIZE, CONDITION_HANDLE_HEIGHT, CONDITION_HEADER_SIZE, CONDITION_HSPACING, CONDITION_WITH_DECISION_POINT_HEADER_SIZE, LINE_RADIUS, } from '../constants';
import { ItemBase } from './ItemBase';
var ConditionItem = (function (_super) {
    __extends(ConditionItem, _super);
    function ConditionItem(itemData, root, parent) {
        var _this = _super.call(this, itemData, root, parent) || this;
        _this.labelYes = null;
        _this.labelNo = null;
        if (_this.children) {
            _this.children = [_this.noSequence, _this.yesSequence];
        }
        _this.translate = root.injector.get(TranslateService);
        _this.translate.get('MA.YES').subscribe(function (res) {
            _this.labelYes = res;
        });
        _this.translate.get('MA.NO').subscribe(function (res) {
            _this.labelNo = res;
        });
        return _this;
    }
    Object.defineProperty(ConditionItem.prototype, "yesSequence", {
        get: function () {
            return this.children.find(function (item) { return item.params.pathKey === 'true'; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionItem.prototype, "noSequence", {
        get: function () {
            return this.children.find(function (item) { return item.params.pathKey === 'false'; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionItem.prototype, "hasLabel", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionItem.prototype, "leftHalfWidth", {
        get: function () {
            return this.noSequence.position.width + CONDITION_HSPACING / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionItem.prototype, "rightHalfWidth", {
        get: function () {
            return this.yesSequence.position.width + CONDITION_HSPACING / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionItem.prototype, "hasDecisionPoint", {
        get: function () {
            return this.noSequence.hasDecisionPoint || this.yesSequence.hasDecisionPoint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionItem.prototype, "headerLength", {
        get: function () {
            return this.hasDecisionPoint ? CONDITION_WITH_DECISION_POINT_HEADER_SIZE : CONDITION_HEADER_SIZE;
        },
        enumerable: true,
        configurable: true
    });
    ConditionItem.prototype.getLabel = function () {
        return "<div class=\"labels listener\">\n            <div class=\"label label-yes\">" + this.labelYes + "</div>\n            <div class=\"label label-no\">" + this.labelNo + "</div>\n            <div class=\"condition-rombus\">\n                <img src=\"/~/icon/OfficeWhite/16x16/arrow_fork.png\" >\n            </div>\n        </div>";
    };
    ConditionItem.prototype.computeChildrenOffsets = function () {
        if (!this.children || this.children.length === 0) {
            this.position.width = this.visual.width;
            this.position.height = this.visual.height;
            this.position.dx = this.visual.dx;
            this.visual.offsetX = 0;
            this.visual.offsetY = 0;
            return;
        }
        var offsetY = this.visual.height + this.headerLength;
        var height = 0;
        var width = 0;
        var maxChildWidth = 0;
        var dx;
        this.children.forEach(function (child) {
            child.position.offsetY = offsetY;
            child.position.offsetX = width;
            width += child.position.width + CONDITION_HSPACING;
            height = Math.max(height, child.position.height);
            maxChildWidth = Math.max(maxChildWidth, child.position.width);
        });
        height = this.visual.height + this.headerLength + height + CONDITION_FOOTER_SIZE;
        dx =
            (this.noSequence.position.offsetX +
                this.noSequence.position.dx +
                this.yesSequence.position.offsetX +
                this.yesSequence.position.dx) /
                2;
        if (this.visual.dx > dx) {
            var shift_1 = this.visual.dx - dx;
            this.children.forEach(function (child) {
                child.position.offsetX += shift_1;
            });
            dx = this.visual.dx;
        }
        this.visual.offsetX = dx - this.visual.dx;
        this.visual.offsetY = 0;
        var lastChildIndex = this.children.length - 1;
        width = this.leftHalfWidth + this.rightHalfWidth;
        this.position.width = width;
        this.position.height = height;
        this.position.dx = dx;
    };
    ConditionItem.prototype.computeXY = function (parentX, parentY) {
        _super.prototype.computeXY.call(this, parentX, parentY);
        this.visual.x = this.position.x + this.visual.offsetX;
        this.visual.y = this.position.y + this.visual.offsetY;
    };
    ConditionItem.prototype.getConnectors = function (resultArray) {
        var _this = this;
        if (!this.children) {
            return;
        }
        var x1 = this.visual.x + this.visual.dx;
        var hy = this.visual.y + this.visual.height;
        var fy = this.position.y + this.position.height;
        var idx = 0;
        this.children.forEach(function (child) {
            var pos = child.position;
            var x2 = pos.x + pos.dx;
            var y1 = pos.y;
            var y2 = pos.y + pos.height;
            resultArray.push(new Connector(_this, idx++, x1, hy - CONDITION_HANDLE_HEIGHT + CONDITION_CONNECTOR_HEIGHT_DELTA, x2, y1, hy + LINE_RADIUS));
            if (!child.hasFinal) {
                resultArray.push(new Connector(_this, idx++, x2, y2, x1, fy, fy - LINE_RADIUS));
            }
        });
    };
    ConditionItem.prototype.setVisual = function (domElement) {
        _super.prototype.setVisual.call(this, domElement);
        this.visual.height += CONDITION_HANDLE_HEIGHT - CONDITION_CONNECTOR_HEIGHT_DELTA;
    };
    return ConditionItem;
}(ItemBase));
export { ConditionItem };
//# sourceMappingURL=ConditionItem.js.map