/*jslint browser: true*/
/*global console, Hammer, $*/

/**
 * Tindercards.js
 *
 * @author www.timo-ernst.net
 * @module Tindercardsjs
 * License: MIT
 */
var Tindercardsjs = Tindercardsjs || {};

Tindercardsjs = (function () {
  	'use strict';
  
  	var exports = {};
  
	/**
	   * Represents one card
	   *
	   * @memberof module:Tindercardsjs
	   * @class
	*/
  	exports.card = function (cardid, desc, percent) {
    
    var jqo;
    
    /**
     * Returns a jQuery representation of this card
     *
     * @method
     * @public
     * @return {object} A jQuery representation of this card
     */
    this.tojQuery = function () {
    	if (!jqo) {
        	jqo = $('<div class="tc-card" id="card_' + cardid+ '">')
        			.attr('data-cardid', cardid)
        			.attr('data-cardpercent', percent)
        			.html(desc);
      	}
      	return jqo;
    };

  };
  
  /**
   * Initializes swipe
   *
   * @private
   * @function
   */
  	function initSwipe(onSwiped) {
    	var $topcard = $('.tc-card'),
      		deltaX = 0,
      		deltaY = 0;

	    $topcard.each(function () {

	    	var $card = $(this);
	    	var mc = new Hammer((this));
	    		mc.get('pan').set({direction: Hammer.DIRECTION_ALL})

	      	mc.on("panleft panright panend panup pandown", function (ev) {
	        	var transform,
	          		yfactor = ev.deltaX >= 0 ? -1 : 1,
	          		resultEvent = {},
	          		percent = '';

	          	var vardPrev = $('#prevCardId').val(),
	        		$cardPrev = $('#card_' + vardPrev);

	        	if (ev.type === 'panend') {
	          		if (deltaX > 100) {
	            		transform = 'translate3d(' + (5 * deltaX) + 'px, ' + (yfactor * 1.5 * deltaX) + 'px, 0)';
			            $card.css({
			              'transition': '-webkit-transform 0.5s',
			              '-webkit-transform': transform + ' rotate(' + ((-5 * deltaX) / 10) + 'deg)'
			            });
			            setTimeout(function () {
			              	$card.css({
			                	'display': 'none'
			              	});


			              	if (typeof onSwiped === 'function') {
				                resultEvent.cardid = $card.attr('data-cardid');
				                resultEvent.card = $card;
				                percent = $card.attr('data-cardpercent');
								
				                //Set percent for card currently
				                $('.progress-bar').css('width', percent + '%');

				                var sizeOfCard = $('.tc-card').length;
				                if(resultEvent.cardid == sizeOfCard) {
				                	$('#main').hide();
				                	$('#success').css('visibility','visible');
				                	$('#success .wrap').html('<img src="onoff2.gif" class="img-responsive">');
				                	$('#top-bar').css('visibility:hidden');
				                }

				                // Assign this card id then we can prev it if need
				                $('#prevCardId').val(resultEvent.cardid);
				                if (deltaX > 100) {
				                	resultEvent.direction = 'right';
				                } else {
				                  	resultEvent.direction = 'down';
				                }
			                	onSwiped(resultEvent);
			              	}
			            }, 500);

	          		} else {
			            transform = 'translate3d(0px, 0, 0)';
			            $card.css({
			              'transition': '-webkit-transform 0.3s',
			              '-webkit-transform': transform + ' rotate(0deg)'
			            });
			            setTimeout(function () {
			            	$card.css({
			                	'transition': '-webkit-transform 0s'
			              	});
			            }, 300);
	          		}
	          	} else if (ev.type === 'panup' || ev.type === 'pandown') {
		          // No vertical scroll
		          ev.preventDefault();
	        	} else {
	          		deltaX = ev.deltaX;
	          		transform = 'translate3d(' + deltaX + 'px, ' + (yfactor * 0.15 * deltaX) + 'px, 0)';
			        $card.css({
			            '-webkit-transform': transform + ' rotate(' + ((-1 * deltaX) / 10) + 'deg)'
			        });
	        	}

	        	// Left swipe
	        	if (ev.type === 'panend') {
	        		
	          		if (deltaX < -50) {
	          			transform = 'translate3d(0px, 0, 0)';
			            $cardPrev.css({
			              'transition': '-webkit-transform 0.3s',
			              '-webkit-transform': transform + ' rotate(0deg)'
			            });

			            resultEvent.cardid = $card.attr('data-cardid');
		                resultEvent.card = $card;

		                var returnCardId = '';
		                returnCardId = resultEvent.cardid - 2;

		                percent = $('#card_' + returnCardId).attr('data-cardpercent');
		                if (returnCardId <=0) {
		                	$('.progress-bar').css('width', '2%');
		                } else {
		                	$('.progress-bar').css('width', percent + '%');
		                }
		                // Assign this card id then we can prev it if need
		                $('#prevCardId').val(returnCardId);

			            setTimeout(function () {
			              	$cardPrev.css({
			                	'display': 'block'
			              	});
			              	if (typeof onSwiped === 'function') {
				                

				                if (deltaX < -50) {
				                  resultEvent.direction = 'left';
				                } else {
				                  resultEvent.direction = 'up';
				                }
			                	onSwiped(resultEvent);
			              	} 
			            }, 300);
	          		} else {
			            transform = 'translate3d(' + (5 * deltaX) + 'px, ' + (yfactor * 1.5 * deltaX) + 'px, 0)';
			            $cardPrev.css({
			              'transition': '-webkit-transform 0.5s',
			              '-webkit-transform': transform + ' rotate(' + ((-5 * deltaX) / 10) + 'deg)'
			            });
	          		}
	          	} else if (ev.type === 'panup' || ev.type === 'pandown') {
		          // No vertical scroll
		          ev.preventDefault();
	        	} else {
	          		deltaX = ev.deltaX;
	          		transform = 'translate3d(' + deltaX + 'px, ' + (yfactor * 0.15 * deltaX) + 'px, 0)';
			        $cardPrev.css({
			            '-webkit-transform': transform + ' rotate(' + ((-1 * deltaX) / 10) + 'deg)'
			        });
	        	}

	        	// Pan Down
	        	/*if(ev.type === 'panend') {

	        		if(ev.center.y > 100){
		        		transform = 'translate3d(0px,' + ev.center.y + 'px, 0)';
			            $card.css({
			              'transition': '-webkit-transform 0.5s',
			              '-webkit-transform': transform + ' rotate(0deg)'
			            });
		        		setTimeout(function () {
			              	$card.css({
			                	'display': 'none'
			              	});

			              	if (typeof onSwiped === 'function') {
				                resultEvent.cardid = $card.attr('data-cardid');
				                resultEvent.card = $card;
				                percent = $card.attr('data-cardpercent');
								
				                //Set percent for card currently
				                $('.progress-bar').css('width', percent + '%');

				                var sizeOfCard = $('.tc-card').length;
				                if(resultEvent.cardid == sizeOfCard) {
				                	$('#main').hide();
				                	$('#success').show();
				                }

				                // Assign this card id then we can prev it if need
				                $('#prevCardId').val(resultEvent.cardid);
				                if (deltaY > 50) {
				                	resultEvent.direction = 'down';
				                } else {
				                  	resultEvent.direction = 'undefined';
				                }
			                	onSwiped(resultEvent);
			              	}
			            }, 500);
			        } else {
			        	transform = 'translate3d(0px,0px, 0)';
			            $card.css({
			              'transition': '-webkit-transform 0.5s',
			              '-webkit-transform': transform + ' rotate(0deg)'
			            });
			        }
	        	} else {
	        		transform = 'translate3d(0px,0px, 0)';
		            $card.css({
		              'transition': '-webkit-transform 0.5s',
		              '-webkit-transform': transform + ' rotate(0deg)'
		            });
	        	}*/

	      	});
	    });
  	}
  
  /**
   * Renders the given cards
   *
   * @param {array} cards The cards (must be instanceof Tindercardsjs.card)
   * @param {jQuery} $target The container in which the cards should be rendered into
   * @param {function} onSwiped Callback when a card was swiped
   * @example Tindercardsjs.render(cards, $('#main'));
   * @method
   * @public
   * @memberof module:Tindercardsjs
   */
  	exports.render = function (cards, $target, onSwiped) {
    	var i,
      		$card;
    
    	if (cards) {
      		for (i = 0; i < cards.length; i = i + 1) {
        		$card = cards[i].tojQuery().appendTo($target).css({
		          'position': 'absolute',
		          'background-color': '#fff',
		          'height': '430px',
		          'left': '10px',
		          'top': '10px',
		          'right': '10px'
		        });
        
		        $card.find('.tc-card-img').css({
		          'width': '100%',
		          'border-radius': '10px 10px 0 0'
		        });
		        
		        $card.find('.tc-card-name').css({
		          'margin-top': '0',
		          'margin-bottom': '5px'
		        });
		        
		        $card.find('.tc-card-body').css({
		          'position': 'relative',
		          'left': '10px',
		          'width': '280px'
		        });
        
      		}
      
      		initSwipe(onSwiped);
      
    	} else {
      		console.warn('tindercards array empty, no cards will be displayed');
    	}
  	};
  
  	return exports;
  
}());